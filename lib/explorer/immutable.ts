import { GetSourceCodeSchema } from "../explorer";

export const convert = (data: any): GetSourceCodeSchema => {
    if (data.message || !data.abi) {
        return {
            status: "0",
            message: "NOTOK",
            result: data.message || "Unverified contract"
        };
    }

    return {
        status: "1",
        message: "OK",
        result: [{
            SourceCode: data.source_code,
            ABI: JSON.stringify(data.abi),
            ContractName: data.name,
            CompilerVersion: data.compiler_version,
            OptimizationUsed: data.optimization_enabled ? "1" : "0",
            Runs: data.optimization_runs || "200",
            ConstructorArguments: data.constructor_arguments || "",
            EVMVersion: data.evm_version || "default",
            Library: JSON.stringify(data.external_libraries) || "",
            LicenseType: "0",
            Proxy: "",
            Implementation: "",
            SwarmSource: "",
        }]
    };
}