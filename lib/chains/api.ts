import { ChainID } from "./chain-id";

export const getAPI = (network: string): string => {
    switch (network) {
        case ChainID.ETHEREUM_MAINNET:
            return "https://api.etherscan.io";
        case ChainID.ETHEREUM_GOERLI:
            return "https://api-goerli.etherscan.io";
        case ChainID.ETHEREUM_SEPOLIA:
            return "https://api-sepolia.etherscan.io";
        case ChainID.METIS_ANDROMEDA:
            return "https://andromeda-explorer.metis.io";
        case ChainID.METIS_SEPOLIA:
            return "https://sepolia.explorer.metisdevops.link";
        case ChainID.ARBITRUM_ONE:
            return "https://api.arbiscan.io";
        case ChainID.ARBITRUM_GOERLI:
            return "https://api-goerli.arbiscan.io";
        case ChainID.ARBITRUM_NOVA:
            return "https://api-nova.arbiscan.io";
        default:
            return "";
    }
}
