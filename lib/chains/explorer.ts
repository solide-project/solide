import { ChainID } from "./chain-id";

export const getExplorer = (network: string): string => {
    switch (network) {
        case ChainID.ETHEREUM_MAINNET:
            return Explorer.ETHEREUM_MAINNET;
        case ChainID.ETHEREUM_GOERLI:
            return Explorer.ETHEREUM_GOERLI;
        case ChainID.ETHEREUM_SEPOLIA:
            return Explorer.ETHEREUM_SEPOLIA;
        case ChainID.POLYGON_MAINNET:
            return Explorer.POLYGON_MAINNET;
        case ChainID.POLYGON_MUMBAI:
            return Explorer.POLYGON_MUMBAI;
        case ChainID.AVALANCHE_MAINNET:
            return Explorer.AVALANCHE_MAINNET;
        case ChainID.AVALANCHE_FUJI:
            return Explorer.AVALANCHE_FUJI;
        case ChainID.OPTIMISM_MAINNET:
            return Explorer.OPTIMISM_MAINNET;
        case ChainID.OPTIMISM_SEPOLIA:
            return Explorer.OPTIMISM_SEPOLIA;
        case ChainID.FANTOM_MAINNET:
            return Explorer.FANTOM_MAINNET;
        case ChainID.FANTOM_TESTNET:
            return Explorer.FANTOM_TESTNET;
        case ChainID.METIS_ANDROMEDA:
            return Explorer.METIS_ANDROMEDA;
        case ChainID.METIS_SEPOLIA:
            return Explorer.METIS_SEPOLIA;
        default:
            return Explorer.ETHEREUM_MAINNET;
    }
}

enum Explorer {
    ETHEREUM_MAINNET = 'https://etherscan.io',
    ETHEREUM_GOERLI = 'https://goerli.etherscan.io',
    ETHEREUM_SEPOLIA = 'https://sepolia.etherscan.io',
    POLYGON_MAINNET = 'https://polygonscan.com',
    POLYGON_MUMBAI = 'https://mumbai.polygonscan.com',
    AVALANCHE_MAINNET = 'https://snowtrace.io',
    AVALANCHE_FUJI = 'https://testnet.snowtrace.io',
    OPTIMISM_MAINNET = 'https://optimistic.etherscan.io',
    OPTIMISM_SEPOLIA = 'https://sepolia-optimism.etherscan.io',
    FANTOM_MAINNET = 'https://ftmscan.com',
    FANTOM_TESTNET = 'https://testnet.ftmscan.com',
    METIS_ANDROMEDA = 'https://andromeda-explorer.metis.io',
    METIS_SEPOLIA = 'https://sepolia.explorer.metisdevops.link',
}

