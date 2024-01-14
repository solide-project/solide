import { ChainID } from "./chain-id";

export const getNetworkNameFromChainID = (chainId: string) => {
    switch (chainId) {
        case ChainID.ETHEREUM_MAINNET:
            return "Etheruem Mainnet";
        case ChainID.ETHEREUM_GOERLI:
            return "Etheruem Goerli";
        case ChainID.ETHEREUM_SEPOLIA:
            return "Etheruem Seoplia";
        case ChainID.ETHEREUM_HOLESKY:
            return "Holesky Test Network";
        case ChainID.AVALANCHE_MAINNET:
            return "Avalanche Mainnet";
        case ChainID.AVALANCHE_FUJI:
            return "Avalanche Testnet";
        case ChainID.METIS_ANDROMEDA:
            return "Metis Andormeda";
        case ChainID.METIS_SEPOLIA:
            return "Metis Seoplia";
        case ChainID.ARBITRUM_NOVA:
            return "Arbitrum Nova";
        case ChainID.ARBITRUM_ONE:
            return "Arbitrum One";
        case ChainID.ARBITRUM_GOERLI:
            return "Arbitrum Goerli";
        case ChainID.OASIS_EMERALD:
            return "Oasis Emerald";
        case ChainID.OASIS_SAPPHIRE:
            return "Oasis Sapphire";
        case ChainID.OASIS_SAPPHIRE_TESTNET:
            return "Oasis Sapphire Testnet";
        case ChainID.IMMUTABLE_MAINNET:
            return "Immutable Mainnet";
        case ChainID.IMMUTABLE_TESTNET:
            return "Immutable Testnet";

        case ChainID.POLYGON_MAINNET:
            return "Polygon Mainnet";
        case ChainID.POLYGON_MUMBAI:
            return "Polygon Mumbai";
        case ChainID.OPTIMISM_MAINNET:
            return "Optimism Mainnet";
        case ChainID.OPTIMISM_SEPOLIA:
            return "Optimism Georli";
        case ChainID.FANTOM_MAINNET:
            return "Fantom Mainnet";
        case ChainID.FANTOM_TESTNET:
            return "Fantom Testnet";
        case ChainID.BASE_MAINNET:
            return "Base Mainnet";
        case ChainID.BASE_SEPOLIA:
            return "Base Seoplia";
        case ChainID.BNB_MAINNET:
            return "BNB Smart Chain";
        case ChainID.BNB_TESTNET:
            return "BNB Smart Chain Testnet";
        case ChainID.LINEA_MAINNET:
            return "Linea Mainnet";
        case ChainID.LINEA_TESTNET:
            return "Linea Testnet";
        case ChainID.MOONBEAM_MAINNET:
            return "Moonbeam Mainnet";
        case ChainID.MOONBASE_ALPHA:
            return "Moonbase Alpha Testnet";
        case ChainID.MOONRIVER_MAINNET:
            return "Moonriver";
        case ChainID.CELO_MAINNET:
            return "Celo Mainnet";
        case ChainID.CELO_ALFAJORES:
            return "Celo Alfajores Testnet";
        case ChainID.GNOSIS_MAINNET:
            return "Gnosis Mainnet";
        case ChainID.CRONOS_MAINNET:
            return "Cronos Mainnet";
        case ChainID.SCROLL_MAINNET:
            return "Scroll Mainnet";
        case ChainID.SCROLL_SEPOLIA:
            return "Scroll Seoplia";
        case ChainID.MANTLE_MAINNET:
            return "Mantle";
        case ChainID.MANTLE_TESTNET:
            return "Mantle Testnet";
        case ChainID.BITTORRENT_MAINNET:
            return "BitTorrent Mainnet";
        case ChainID.BITTORRENT_TESTNET:
            return "Donau Testnet";
        case ChainID.XDC_MAINNET:
            return "XDC Network";
        case ChainID.CANTO_MAINNET:
            return "Canto Mainnet";
        case ChainID.CANTO_TESTNET:
            return "Canto Testnet";
        case ChainID.KAVA_MAINNET:
            return "Kava Mainnet";
        case ChainID.KAVA_TESTNET:
            return "Kava Testnet";
        case ChainID.ROLLUX_MAINNET:
            return "Rollux";
        case ChainID.ROLLUX_TESTNET:
            return "Rollux Tanenbaum Testnet";
        case ChainID.SYSCOIN_MAINNET:
            return "Syscoin Mainnet";
        case ChainID.SYSCOIN_TESTNET:
            return "Syscoin Tanenbaum Testnet";
        case ChainID.BOBA_ETHEREUM:
            return "Boba Mainnet";
        case ChainID.MANTA_PACIFIC:
            return "Manta Pacific Mainnet";
        case ChainID.MANTA_TESTNET:
            return "Manta Pacific Testnet";
        case ChainID.WEMIX_MAINNET:
            return "Wemix3.0 Mainnet";
        case ChainID.WEMIX_TESTNET:
            return "Wemix3.0 Testnet";
        case ChainID.ASTAR_MAINNET:
            return "Astar";
        case ChainID.SHIDEN_MAINNET:
            return "Shiden";
        case ChainID.SHUBIYA_TESTNET:
            return "Shubiya";
        case ChainID.ZETACHAIN_MAINNET:
            return "ZetaChain Mainnet";
        case ChainID.ZETACHAIN_TESTNET:
            return "ZetaChain Athena 3 Testnet";
        case ChainID.FLARE_MAINNET:
            return "Flare Mainnet";
        case ChainID.FLARE_COSTON:
            return "Flare Coston Testnet";
        case ChainID.FLARE_COSTON2:
            return "Flare Coston 2 Testnet";
        case ChainID.FUSE_MAINNET:
            return "Fuse Mainnet";
        case ChainID.FUSE_SPARK:
            return "Fuse Spark Tesnet";
        case ChainID.SHIBARIUM_MAINNET:
            return "Shibarium Mainnet";
        case ChainID.PUPPYNET_TESTNET:
            return "Puppynet Testnet";
        case ChainID.CONFLUX_MAINNET:
            return "Conflux eSpace Mainnet";
        case ChainID.CONFLUX_TESTNET:
            return "Conflux eSpace Testnet";
        case ChainID.FILECOIN_MAINNET:
            return "Filecoin Mainnet";
        case ChainID.FILECOIN_CALIBRATION:
            return "Filecoin Calibration Testnet";
        case ChainID.ENERGY_WEB_CHAIN:
            return "Energy Web Mainnet";
        case ChainID.ENERGY_WEB_CHAIN_TESTNET:
            return "Energy Web Volta Testnet";
        default:
            return "";
    }
}
