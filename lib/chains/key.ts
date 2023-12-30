import { ChainID } from "./chain-id";

export const getAPIKey = (network: string): string => {
    switch (network) {
        case ChainID.ETHEREUM_MAINNET:
        case ChainID.ETHEREUM_GOERLI:
        case ChainID.ETHEREUM_SEPOLIA:
            return process.env.ETHERSCAN_API_KEY || "";
        default:
            return "";
    }
}
