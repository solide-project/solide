import { GetSourceCodeSchema } from "../explorer";

const generateSources = (data: any): any => {
    let sources: any = {};
    if (!data) return sources;

    data.forEach((element: { file_path: string, source_code: string }) => {
        // Remove the first slash if exist. Its hacky but it works for contracts tested
        if (element.file_path.startsWith("/")) {
            element.file_path = element.file_path.slice(1);
        }

        sources[element.file_path] = {
            content: element.source_code
        }
    });

    return sources;
}

export const convert = async (
    data: any,
    address: string,
    chainId: string,
): Promise<GetSourceCodeSchema> => {
    if (data.errors || !data.abi) {
        return {
            status: "0",
            message: "NOTOK",
            result: "Error loading contract"
        };
    }

    let sourceInput: any = {
        sources: {},
    }

    if (data.language) {
        sourceInput.language = data.language.charAt(0).toUpperCase() + data.language.slice(1);
    }

    if (data.compiler_settings) {
        if (data.compiler_settings.compilationTarget) {
            delete data.compiler_settings.compilationTarget;
        }

        if (data.compiler_settings.libraries) {
            delete data.compiler_settings.libraries;
        }

        sourceInput.settings = data.compiler_settings;
    }

    /**
     * These type of explorer have low reliable source code, its more better to use sourcify 
     * that they provided if it exist. Though, this is a lot slower and a lot of work.
     * As inputs can be IPFS, Github, Swarm, etc. we will use the existing explorer endpoint to correctly
     * construct the files (key from sourify) with its code (value from explorer). Sigh...
     * 
     * If its single file, then don't bother with the sourcify, hence the additional_sources check.
     * Most likely sourcify will be used for multi-file contracts and that sourify will use url as files instead of content
     */
    if (data.sourcify_repo_url && data.additional_sources) {
        const sourify = await fetch(`https://repo.sourcify.dev/contracts/full_match/${chainId}/${address}/metadata.json`);
        if (!sourify.ok) {
            // Couln't find the metadata provided by sourcify, hence resort to default explorer flow
            sourceInput.sources = generateSources(data.additional_sources);
        } else {
            const sourifyData = await sourify.json();

            // IPFS: filePath
            let fileUrls: { [key: string]: string } = {};
            if (sourifyData.sources) {
                Object.entries(sourifyData.sources).forEach(([key, val]: any) => {
                    if (val.urls) {
                        // Currently only support IPFS
                        const ipfsFile: string = val.urls.find((element: string) => element.includes("ipfs")) || "";
                        const cidV0 = /Qm[1-9A-HJ-NP-Za-km-z]{44,}/;
                        const extractedCID = ipfsFile.match(cidV0);
                        if (!extractedCID) {
                            return {
                                status: "0",
                                message: "NOTOK",
                                result: "Sorry the contract is not supported yet."
                            };
                        }
                        fileUrls[`https://api.universalprofile.cloud/ipfs/${extractedCID[0]}`] = key;
                    }
                    // console.log(element);
                });

                const fetchData = (url: string) => {
                    return fetch(url)
                        .then(response => response.text())
                        .then(() => console.log(`${url} success`))
                        .then(content => [url, content])
                        .catch(error => console.error('Error fetching data:', error));
                };
                const dataArray = await Promise.all(Object.keys(fileUrls).map((url: string) => fetchData(url)))
                // All fetch operations are complete, and dataArray contains the results
                dataArray.forEach((element: any) => {
                    sourceInput.sources[fileUrls[element[0]]] = {
                        content: element[1],
                    }
                });
            }
        }
    } else {
        sourceInput.sources = generateSources(data.additional_sources);
    }

    // Here we want to turn the contract source into a .sol path
    let sourceName: string = data.file_path || data.name;
    if (!sourceName.endsWith(".sol")) {
        sourceName = sourceName.concat(".sol");
    }
    sourceInput.sources[sourceName] = {
        content: data.source_code
    }

    return {
        status: "1",
        message: "OK",
        result: [{
            SourceCode: `{${JSON.stringify(sourceInput)}}`,
            ABI: JSON.stringify(data.abi),
            ContractName: data.name,
            CompilerVersion: data.compiler_version,
            OptimizationUsed: data.optimization_enabled ? "1" : "0",
            Runs: data.optimization_runs || "200",
            ConstructorArguments: data.constructor_args || "",
            EVMVersion: data.evm_version || "default",
            Library: JSON.stringify(data.external_libraries) || "",
            LicenseType: "0",
            Proxy: "",
            Implementation: "",
            SwarmSource: "",
        }]
    };
}