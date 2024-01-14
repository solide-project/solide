import { GetSourceCodeSchema } from "../explorer";
import { solcVersion } from "../utils";
import { compilerVersions } from "../versions";

export const convert = async (
    data: any,
): Promise<GetSourceCodeSchema> => {
    if (data.code !== 0 || !data.data) {
        return {
            status: "0",
            message: "NOTOK",
            result: data.message || "Error loading contract"
        };
    }

    if (data.data) {
        let results: any = {
            OptimizationUsed: "0",
            Runs: "200",
            ConstructorArguments: "",
            EVMVersion: "default",
            Library: "",
            LicenseType: "0",
            Proxy: "",
            Implementation: "",
            SwarmSource: "",
        };
        let sourceInput: any = {
            sources: {}
        };
        // Same implementation as blockscout's explorer that uses sourcify except here the metadata is available in API
        const sourifyData = JSON.parse(data.data.metadata);

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
                    // .then(content => console.log(`${content} success`))
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
            results.SourceCode = `{${JSON.stringify(sourceInput)}}`;
            results.ABI = JSON.stringify(sourifyData.output?.abi || {});

            if (sourifyData.settings) {
                if (sourifyData.settings.compilationTarget) {
                    // Since API doesn't provide the contract name we can just get it from the compilationTarget
                    results.ContractName = Object.keys(sourifyData.settings.compilationTarget).pop() || "";

                    // We take the value of the key as Contract Name
                    if (results.ContractName) {
                        results.ContractName = sourifyData.settings.compilationTarget[results.ContractName];
                    }

                    delete sourifyData.settings.compilationTarget;
                }

                if (sourifyData.settings.libraries) {
                    delete sourifyData.settings.libraries;
                }

                sourceInput.settings = sourifyData.settings;
            }

            if (sourifyData.language) {
                results.Language = sourifyData.language;
            }

            if (sourifyData.compiler?.version) {
                // Found a valid version as per sourcify can just be a version number
                const compilerVersion = compilerVersions.find((element: string) => element.includes(sourifyData.compiler.version));
                results.CompilerVersion = compilerVersion || solcVersion;   // Fall back to default if not found
            }

            console.log(results)
            return {
                status: "1",
                message: "OK",
                result: [results]
            };
        }
    }

    return {
        status: "0",
        message: "NOTOK",
        result: "Invalid contract address"
    };
}