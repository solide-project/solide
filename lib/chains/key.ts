import { ChainID } from "./chain-id";

export const getAPIKey = (network: string): string => {
    switch (network) {
        case ChainID.ETHEREUM_MAINNET:
        case ChainID.ETHEREUM_GOERLI:
        case ChainID.ETHEREUM_SEPOLIA:
            return process.env.ETHERSCAN_API_KEY || "";
        case ChainID.ARBITRUM_ONE:
        case ChainID.ARBITRUM_GOERLI:
            return process.env.ARBISCAN_API_KEY || "";
        case ChainID.ARBITRUM_NOVA:
            return process.env.NOVAARBISCAN_API_KEY || "";
        default:
            return "";
    }
}
