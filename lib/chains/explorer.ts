import { ChainID } from "./chain-id";

export const getExplorer = (network: string): string => {
    switch (network) {
        case ChainID.ETHEREUM_MAINNET:
            return Explorer.ETHEREUM_MAINNET;
        case ChainID.ETHEREUM_GOERLI:
            return Explorer.ETHEREUM_GOERLI;
        case ChainID.ETHEREUM_SEPOLIA:
            return Explorer.ETHEREUM_SEPOLIA;
        case ChainID.ETHEREUM_HOLESKY:
            return Explorer.ETHEREUM_HOLESKY;
        case ChainID.METIS_ANDROMEDA:
            return Explorer.METIS_ANDROMEDA;
        case ChainID.METIS_SEPOLIA:
            return Explorer.METIS_SEPOLIA;
        case ChainID.ARBITRUM_GOERLI:
            return Explorer.ARBITRUM_GOERLI;
        case ChainID.ARBITRUM_ONE:
            return Explorer.ARBITRUM_ONE;
        case ChainID.ARBITRUM_NOVA:
            return Explorer.ARBITRUM_NOVA;
        case ChainID.OASIS_EMERALD:
            return Explorer.OASIS_EMERALD;
        case ChainID.OASIS_SAPPHIRE:
            return Explorer.OASIS_SAPPHIRE;
        case ChainID.OASIS_SAPPHIRE_TESTNET:
            return Explorer.OASIS_SAPPHIRE_TESTNET;
        case ChainID.IMMUTABLE_MAINNET:
            return Explorer.IMMUTABLE_MAINNET;
        case ChainID.IMMUTABLE_TESTNET:
            return Explorer.IMMUTABLE_TESTNET;

        case ChainID.AVALANCHE_MAINNET:
            return Explorer.AVALANCHE_MAINNET;
        case ChainID.AVALANCHE_FUJI:
            return Explorer.AVALANCHE_FUJI;
        case ChainID.POLYGON_MAINNET:
            return Explorer.POLYGON_MAINNET;
        case ChainID.POLYGON_MUMBAI:
            return Explorer.POLYGON_MUMBAI;
        case ChainID.OPTIMISM_MAINNET:
            return Explorer.OPTIMISM_MAINNET;
        case ChainID.OPTIMISM_SEPOLIA:
            return Explorer.OPTIMISM_SEPOLIA;
        case ChainID.FANTOM_MAINNET:
            return Explorer.FANTOM_MAINNET;
        case ChainID.FANTOM_TESTNET:
            return Explorer.FANTOM_TESTNET;
        case ChainID.BASE_MAINNET:
            return Explorer.BASE_MAINNET;
        case ChainID.BASE_SEPOLIA:
            return Explorer.BASE_SEPOLIA;
        case ChainID.BNB_MAINNET:
            return Explorer.BNB_MAINNET;
        case ChainID.BNB_TESTNET:
            return Explorer.BNB_TESTNET;
        case ChainID.LINEA_MAINNET:
            return Explorer.LINEA_MAINNET;
        case ChainID.LINEA_TESTNET:
            return Explorer.LINEA_TESTNET;
        case ChainID.MOONBEAM_MAINNET:
            return Explorer.MOONBEAM_MAINNET;
        case ChainID.MOONBASE_ALPHA:
            return Explorer.MOONBASE_ALPHA;
        case ChainID.MOONRIVER_MAINNET:
            return Explorer.MOONRIVER_MAINNET;
        case ChainID.CELO_MAINNET:
            return Explorer.CELO_MAINNET;
        case ChainID.CELO_ALFAJORES:
            return Explorer.CELO_ALFAJORES;
        case ChainID.GNOSIS_MAINNET:
            return Explorer.GNOSIS_MAINNET;
        case ChainID.CRONOS_MAINNET:
            return Explorer.CRONOS_MAINNET;
        case ChainID.SCROLL_MAINNET:
            return Explorer.SCROLL_MAINNET;
        case ChainID.SCROLL_SEPOLIA:
            return Explorer.SCROLL_SEPOLIA;
        case ChainID.MANTLE_MAINNET:
            return Explorer.MANTLE_MAINNET;
        case ChainID.MANTLE_TESTNET:
            return Explorer.MANTLE_TESTNET;
        case ChainID.BITTORRENT_MAINNET:
            return Explorer.BITTORRENT_MAINNET;
        case ChainID.BITTORRENT_TESTNET:
            return Explorer.BITTORRENT_TESTNET;
        case ChainID.XDC_MAINNET:
            return Explorer.XDC_MAINNET;
        case ChainID.CANTO_MAINNET:
            return Explorer.CANTO_MAINNET;
        case ChainID.CANTO_TESTNET:
            return Explorer.CANTO_TESTNET;
        case ChainID.KAVA_MAINNET:
            return Explorer.KAVA_MAINNET;
        case ChainID.KAVA_TESTNET:
            return Explorer.KAVA_TESTNET;
        case ChainID.ROLLUX_MAINNET:
            return Explorer.ROLLUX_MAINNET;
        case ChainID.ROLLUX_TESTNET:
            return Explorer.ROLLUX_TESTNET;
        case ChainID.SYSCOIN_MAINNET:
            return Explorer.SYSCOIN_MAINNET;
        case ChainID.SYSCOIN_TESTNET:
            return Explorer.SYSCOIN_TESTNET;
        case ChainID.BOBA_ETHEREUM:
            return ChainID.BOBA_ETHEREUM;
        case ChainID.MANTA_PACIFIC:
            return Explorer.MANTA_PACIFIC;
        case ChainID.MANTA_TESTNET:
            return Explorer.MANTA_TESTNET;
        case ChainID.WEMIX_MAINNET:
            return Explorer.WEMIX_MAINNET;
        case ChainID.WEMIX_TESTNET:
            return Explorer.WEMIX_TESTNET;
        case ChainID.ASTAR_MAINNET:
            return Explorer.ASTAR_MAINNET;
        case ChainID.ZETACHAIN_MAINNET:
            return Explorer.ZETACHAIN_MAINNET;
        case ChainID.ZETACHAIN_TESTNET:
            return Explorer.ZETACHAIN_TESTNET;
        default:
            return Explorer.ETHEREUM_MAINNET;
    }
}

enum Explorer {
    ETHEREUM_MAINNET = 'https://etherscan.io',
    ETHEREUM_GOERLI = 'https://goerli.etherscan.io',
    ETHEREUM_SEPOLIA = 'https://sepolia.etherscan.io',
    ETHEREUM_HOLESKY = 'https://holesky.etherscan.io',
    METIS_ANDROMEDA = 'https://andromeda-explorer.metis.io',
    METIS_SEPOLIA = 'https://sepolia.explorer.metisdevops.link',
    ARBITRUM_ONE = 'https://arbiscan.io',
    ARBITRUM_GOERLI = 'https://goerli.arbiscan.io',
    ARBITRUM_NOVA = 'https://nova.arbiscan.io',
    OASIS_EMERALD = 'https://explorer.emerald.oasis.dev',
    OASIS_SAPPHIRE = 'https://explorer.sapphire.oasis.io',
    OASIS_SAPPHIRE_TESTNET = 'https://testnet.explorer.sapphire.oasis.dev',
    IMMUTABLE_MAINNET = 'https://explorer.immutable.com',
    IMMUTABLE_TESTNET = 'https://explorer.testnet.immutable.com',

    POLYGON_MAINNET = 'https://polygonscan.com',
    POLYGON_MUMBAI = 'https://mumbai.polygonscan.com',
    AVALANCHE_MAINNET = 'https://snowtrace.io',
    AVALANCHE_FUJI = 'https://testnet.snowtrace.io',
    OPTIMISM_MAINNET = 'https://optimistic.etherscan.io',
    OPTIMISM_SEPOLIA = 'https://sepolia-optimism.etherscan.io',
    FANTOM_MAINNET = 'https://ftmscan.com',
    FANTOM_TESTNET = 'https://testnet.ftmscan.com',
    BASE_MAINNET = 'https://basescan.org',
    BASE_SEPOLIA = 'https://sepolia.basescan.org',
    BNB_MAINNET = 'https://bscscan.com',
    BNB_TESTNET = 'https://testnet.bscscan.com',
    LINEA_MAINNET = 'https://lineascan.build',
    LINEA_TESTNET = 'https://goerli.lineascan.build',
    MOONBEAM_MAINNET = 'https://moonbeam.moonscan.io',
    MOONBASE_ALPHA = 'https://moonbase.moonscan.io',
    MOONRIVER_MAINNET = 'https://moonriver.moonscan.io',
    CELO_MAINNET = 'https://celoscan.io',
    CELO_ALFAJORES = 'https://alfajores.celoscan.io',
    GNOSIS_MAINNET = 'https://gnosisscan.io',
    CRONOS_MAINNET = 'https://cronoscan.com',
    SCROLL_MAINNET = 'https://scrollscan.com',
    SCROLL_SEPOLIA = 'https://sepolia.scrollscan.com',
    MANTLE_MAINNET = 'https://explorer.mantle.xyz',
    MANTLE_TESTNET = 'https://explorer.testnet.mantle.xyz',
    BITTORRENT_MAINNET = 'https://bttcscan.com',
    BITTORRENT_TESTNET = 'https://testnet.bttcscan.com',
    XDC_MAINNET = 'https://explorer.xinfin.network',
    CANTO_MAINNET = 'https://tuber.build',
    CANTO_TESTNET = 'https://testnet.tuber.build',
    KAVA_MAINNET = 'https://kavascan.com',
    KAVA_TESTNET = 'https://testnet.kavascan.com',
    ROLLUX_MAINNET = 'https://explorer.rollux.com',
    ROLLUX_TESTNET = 'https://rollux.tanenbaum.io',
    SYSCOIN_MAINNET = 'https://explorer.syscoin.org',
    SYSCOIN_TESTNET = 'https://tanenbaum.io',
    BOBA_ETHEREUM = 'https://bobascan.com',
    MANTA_PACIFIC = 'https://pacific-explorer.manta.network',
    MANTA_TESTNET = 'https://pacific-explorer.testnet.manta.network',
    WEMIX_MAINNET = 'https://wemixscan.com',
    WEMIX_TESTNET = 'https://testnet.wemixscan.com',
    ASTAR_MAINNET = 'https://blockscout.com/astar',
    ZETACHAIN_MAINNET = '',
    ZETACHAIN_TESTNET = 'https://zetachain-athens-3.blockscout.com',
}

