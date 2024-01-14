import { GetSourceCodeSchema } from "../explorer";

export const convert = (data: any): GetSourceCodeSchema => {
    if (data.errors || !data.abiCode) {
        return {
            status: "0",
            message: "NOTOK",
            result: "Error loading contract"
        };
    }

    return {
        status: "1",
        message: "OK",
        result: [{
            SourceCode: data.sourceCode,
            ABI: data.abiCode,
            ContractName: data.contractName,
            CompilerVersion: data.compiler,
            OptimizationUsed: data.optimization ? "1" : "0",
            Runs: data.optimizationRuns || "200",
            ConstructorArguments: data.constructorArguments || "",
            EVMVersion: data.evmVersion || "default",
            Library: "",
            LicenseType: "0",
            Proxy: "",
            Implementation: "",
            SwarmSource: "",
        }]
    };
}