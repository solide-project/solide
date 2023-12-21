import { ChainID } from "./chain-id";

export const getAPI = (network: string): string => {
    switch (network) {
        case ChainID.ETHEREUM_MAINNET:
            return API.ETHEREUM_MAINNET;
        case ChainID.ETHEREUM_GOERLI:
            return API.ETHEREUM_GOERLI;
        case ChainID.ETHEREUM_SEPOLIA:
            return API.ETHEREUM_SEPOLIA;
        case ChainID.POLYGON_MAINNET:
            return API.POLYGON_MAINNET;
        case ChainID.POLYGON_MUMBAI:
            return API.POLYGON_MUMBAI;
        case ChainID.AVALANCHE_MAINNET:
            return API.AVALANCHE_MAINNET;
        case ChainID.AVALANCHE_FUJI:
            return API.AVALANCHE_FUJI;
        case ChainID.FANTOM_MAINNET:
            return API.FANTOM_MAINNET;
        case ChainID.FANTOM_TESTNET:
            return API.FANTOM_TESTNET;
        default:
            return API.ETHEREUM_MAINNET;
    }
}

export enum API {
    ETHEREUM_MAINNET = 'https://api.etherscan.io/',
    ETHEREUM_GOERLI = 'https://api-goerli.etherscan.io/',
    ETHEREUM_SEPOLIA = 'https://api-sepolia.etherscan.io/',
    POLYGON_MAINNET = 'https://api.polygonscan.com/',
    POLYGON_MUMBAI = 'https://api-testnet.polygonscan.com/',
    FANTOM_MAINNET = 'https://api.ftmscan.com/',
    FANTOM_TESTNET = 'https://api-testnet.ftmscan.com/',
    AVALANCHE_MAINNET = 'https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/',
    AVALANCHE_FUJI = 'https://api.routescan.io/v2/network/mainnet/evm/43113/etherscan/',
}