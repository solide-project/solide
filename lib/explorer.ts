import { getAPIKey } from "./chains/key";
import { ChainID } from "./chains/chain-id";
import { getExplorer } from "./chains/explorer";
import { getAPI } from "./chains/api";
import { convert as cantoConvert } from "./explorer/canto";
import { convert as immuntableConvert } from "./explorer/immutable";
import { convert as xdcConvert } from "./explorer/xdc";

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

const getEndPoint = (chain: string, address: string): string => {
    switch (chain) {
        case ChainID.IMMUTABLE_MAINNET:
        case ChainID.IMMUTABLE_TESTNET:
        case ChainID.CANTO_MAINNET:
        case ChainID.MANTA_PACIFIC:
        case ChainID.MANTA_TESTNET:
        case ChainID.ZETACHAIN_TESTNET:
            return `api/v2/smart-contracts/${address}`;
        case ChainID.XDC_MAINNET:
            return `api/contracts/${address}`;
        default:
            return `api?module=contract&action=getsourcecode&address=${address}`;
    }
}

export const getSourceCode = async (chain: string, address: string): Promise<GetSourceCodeSchema> => {
    let uri = `${getAPI(chain)}/${getEndPoint(chain, address)}`;
    const apiKey = getAPIKey(chain);
    if (apiKey) {
        uri = uri.concat(`&apikey=${apiKey}`)
    }

    console.log(uri)
    try {
        const response = await fetch(uri)

        switch (chain) {
            case ChainID.METIS_ANDROMEDA:
            case ChainID.METIS_SEPOLIA:
            case ChainID.MANTLE_MAINNET:
            case ChainID.MANTLE_TESTNET:
            case ChainID.KAVA_MAINNET:
            case ChainID.KAVA_TESTNET:
            case ChainID.ROLLUX_MAINNET:
            case ChainID.ROLLUX_TESTNET:
            case ChainID.CANTO_TESTNET:
            case ChainID.ASTAR_MAINNET:
                const data = await response.json() as any;
                if (data.result && data.result[0]) {
                    if (data.result[0].AdditionalSources) {
                        let sources: any = {}

                        const sourceName = data.result[0].FileName || data.result[0].ContractName as string;
                        sources[sourceName] = {
                            "content": data.result[0].SourceCode as string,
                        };
                        (data.result[0].AdditionalSources).forEach((element: { Filename: string, SourceCode: string }) => {
                            if (element.Filename.startsWith("/")) {
                                element.Filename = element.Filename.slice(1);
                            }

                            sources[element.Filename] = {
                                "content": element.SourceCode
                            }
                        })

                        if (data.result[0].CompilerSettings) {
                            if (data.result[0].CompilerSettings.compilationTarget) {
                                delete data.result[0].CompilerSettings.compilationTarget;
                            }

                            if (data.result[0].CompilerSettings.Libraries) {
                                delete data.result[0].CompilerSettings.Libraries;
                            }
                        }

                        const input: any = {
                            settings: data.result[0].CompilerSettings,
                            sources: sources,
                        }
                        input.language = "Solidity";

                        data.result[0].SourceCode = `{${JSON.stringify(input)}}`
                    }
                }

                return data;
            case ChainID.IMMUTABLE_MAINNET:
            case ChainID.IMMUTABLE_TESTNET:
            case ChainID.CANTO_MAINNET:
            case ChainID.MANTA_PACIFIC:
            case ChainID.MANTA_TESTNET:
            case ChainID.ZETACHAIN_TESTNET:
                return await cantoConvert(await response.json(), address, chain);
            case ChainID.XDC_MAINNET:
                return xdcConvert(await response.json());

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
