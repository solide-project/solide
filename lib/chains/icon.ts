import { ChainID } from "./chain-id";

export const getIconByChainId = (chainId: string): string => {
    switch (chainId) {
        case ChainID.ETHEREUM_MAINNET:
        case ChainID.ETHEREUM_GOERLI:
        case ChainID.ETHEREUM_SEPOLIA:
            return "https://www.ankr.com/rpc/static/media/eth.4ca298ae.svg";
        case ChainID.POLYGON_MAINNET:
        case ChainID.POLYGON_MUMBAI:
            return "https://www.ankr.com/rpc/static/media/polygon-zkevm.8c6d01fe.svg";
        case ChainID.AVALANCHE_FUJI:
        case ChainID.AVALANCHE_MAINNET:
            return "https://www.ankr.com/rpc/static/media/avax.04d124b0.svg";
        case ChainID.OPTIMISM_MAINNET:
        case ChainID.OPTIMISM_SEPOLIA:
            return "https://www.ankr.com/rpc/static/media/optimism.53b7f574.svg";
        case ChainID.FANTOM_MAINNET:
        case ChainID.FANTOM_TESTNET:
            return "https://www.ankr.com/rpc/static/media/ftm.c92e9c29.svg";
        case ChainID.METIS_ANDROMEDA:
        case ChainID.METIS_SEPOLIA:
            return "https://www.ankr.com/rpc/static/media/metis.77fe8764.svg";
        case ChainID.ARBITRUM_ONE:
        case ChainID.ARBITRUM_GOERLI:
            return "https://www.ankr.com/rpc/static/media/arbitrum.5e332f88.svg";
        case ChainID.ARBITRUM_NOVA:
            return "https://www.ankr.com/rpc/static/media/arbitrum-nova.b93b7dfa.svg";
        default:
            return "";
    }
};