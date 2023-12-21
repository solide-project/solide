import { getAPI } from "./chains/api";

export interface GetSourceCodeSchema {
    status: string;
    message: string;
    result: [
        {
            SourceCode: string;
            ABI: string;
            ContractName: string;
            CompilerVersion: string;
            OptimizationUsed: string;
            Runs: string;
            ConstructorArguments: string;
            EVMVersion: string;
            Library: string;
            LicenseType: string;
            Proxy: string;
            Implementation: string;
            SwarmSource: string;
        }
    ] | string;
}

export const getSourceCode = async (chain: string, address: string): Promise<GetSourceCodeSchema> => {
    const uri = `${getAPI(chain)}/api?module=contract&action=getsourcecode&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`
    try {
        const response = await fetch(uri)
        const data = await response.json() as GetSourceCodeSchema;
        return data;
    }
    catch (error) {
        return {
            status: "0",
            message: "NOTOK",
            result: "Invalid contract address"
        };
    }
}