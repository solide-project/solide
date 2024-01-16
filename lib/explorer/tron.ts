import { GetSourceCodeSchema } from "../explorer";
import { solcVersion } from "../utils";
import { compilerVersions } from "../versions";

export const isTronAddress = (address: string): boolean => {
    return address.substring(0, 1) === "T" && address.length === 34;
}

export const convert = async (
    data: any,
    address: string,
    chainId: string,
): Promise<GetSourceCodeSchema> => {
    if (data.errmsg || !data.data) {
        return {
            status: "0",
            message: "NOTOK",
            result: data.errmsg || "Error loading contract"
        };
    }

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
        sources: {},
    };

    (data.data?.contract_code || []).forEach((element: any) => {
        sourceInput.sources[element.name] = {
            content: atob(element.code)
        }
    });
    results.SourceCode = `{${JSON.stringify(sourceInput)}}`;

    results.ABI = data.data.abi || "";
    results.OptimizationUsed = data.data.optimizer || "0";
    results.Runs = data.data.optimizer_runs || "0";
    results.LicenseType = data.data.license || "0";
    results.ContractName = data.data.contract_name || "";
    const match = (data.data.compiler || "").match(/tron-(\d+\.\d+\.\d+)/);
    const versionNumber = match ? match[1] : null;
    if (versionNumber) {
        // Found a valid version as per sourcify can just be a version number
        const compilerVersion = compilerVersions.find((element: string) => element.includes(versionNumber));
        results.CompilerVersion = compilerVersion || solcVersion;   // Fall back to default if not found
    }

    if (!results.ContractName.endsWith(".sol")) {
        results.ContractName = results.ContractName.concat(".sol");
    }

    return {
        status: "1",
        message: "OK",
        result: [results]
    };
}
