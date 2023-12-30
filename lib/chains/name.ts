import { ChainID } from "./chain-id";

export const getNetworkNameFromChainID = (chainId: string) => {
    switch (chainId) {
        case ChainID.ETHEREUM_MAINNET:
            return "Etheruem Mainnet";
        case ChainID.ETHEREUM_GOERLI:
            return "Etheruem Goerli";
        case ChainID.ETHEREUM_SEPOLIA:
            return "Etheruem Seoplia";
        case ChainID.POLYGON_MAINNET:
            return "Polygon Mainnet";
        case ChainID.POLYGON_MUMBAI:
            return "Polygon Mumbai";
        case ChainID.AVALANCHE_MAINNET:
            return "Avalanche Mainnet";
        case ChainID.AVALANCHE_FUJI:
            return "Avalanche Testnet";
        case ChainID.OPTIMISM_MAINNET:
            return "Optimism Mainnet";
        case ChainID.OPTIMISM_SEPOLIA:
            return "Optimism Seoplia";
        case ChainID.FANTOM_MAINNET:
            return "Fantom Mainnet";
        case ChainID.FANTOM_TESTNET:
            return "Fantom Testnet";
        case ChainID.METIS_ANDROMEDA:
            return "Metis Andormeda";
        case ChainID.METIS_SEPOLIA:
            return "Metis Seoplia";
        default:
            return "";
    }
}
