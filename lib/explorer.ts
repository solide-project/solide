import { getAPIKey } from "./chains/key";
import { ChainID } from "./chains/chain-id";
import { getExplorer } from "./chains/explorer";
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
    let uri = `${getAPI(chain)}/api?module=contract&action=getsourcecode&address=${address}`;
    const apiKey = getAPIKey(chain);
    if (apiKey) {
        uri = uri.concat(`&apikey=${apiKey}`)
    }

    try {
        const response = await fetch(uri)

        if (ChainID.METIS_ANDROMEDA === chain || ChainID.METIS_SEPOLIA === chain) {
            // Need to trainsform the response to the same format as EVM based API.
            // Mainly for METIS, extra param called AdditionalSources
            const data = await response.json() as any;

            if (data.result && data.result[0]) {
                if (data.result[0].AdditionalSources) {
                    const sourceName = data.result[0].FileName as string;
                    let sources: any = {}

                    sources[sourceName] = {
                        "content": data.result[0].SourceCode as string,
                    };
                    (data.result[0].AdditionalSources).forEach((element: { Filename: string, SourceCode: string }) => {
                        sources[element.Filename] = {
                            "content": element.SourceCode
                        }
                    })

                    const input: any = {
                        settings: data.result[0].CompilerSettings,
                        sources: sources,
                    }
                    input.language = "Solidity";

                    data.result[0].SourceCode = `{${JSON.stringify(input)}}`
                }
            }

            return data;
        }

        let data = await response.json() as GetSourceCodeSchema;
        // console.log(uri)
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
