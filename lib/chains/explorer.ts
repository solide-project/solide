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
        case ChainID.SHIDEN_MAINNET:
            return Explorer.SHIDEN_MAINNET;
        case ChainID.SHUBIYA_TESTNET:
            return Explorer.SHUBIYA_TESTNET;
        case ChainID.ZETACHAIN_MAINNET:
            return Explorer.ZETACHAIN_MAINNET;
        case ChainID.ZETACHAIN_TESTNET:
            return Explorer.ZETACHAIN_TESTNET;
        case ChainID.FLARE_MAINNET:
            return Explorer.FLARE_MAINNET;
        case ChainID.FLARE_COSTON:
            return Explorer.FLARE_COSTON;
        case ChainID.FLARE_COSTON2:
            return Explorer.FLARE_COSTON2;
        case ChainID.FUSE_MAINNET:
            return Explorer.FUSE_MAINNET;
        case ChainID.FUSE_SPARK:
            return Explorer.FUSE_SPARK;
        case ChainID.SHIBARIUM_MAINNET:
            return Explorer.SHIBARIUM_MAINNET;
        case ChainID.PUPPYNET_TESTNET:
            return Explorer.PUPPYNET_TESTNET;
        case ChainID.CONFLUX_MAINNET:
            return Explorer.CONFLUX_MAINNET;
        case ChainID.CONFLUX_TESTNET:
            return Explorer.CONFLUX_TESTNET;
        case ChainID.FILECOIN_MAINNET:
            return Explorer.FILECOIN_MAINNET;
        case ChainID.FILECOIN_CALIBRATION:
            return Explorer.FILECOIN_CALIBRATION;
        case ChainID.ENERGY_WEB_CHAIN:
            return Explorer.ENERGY_WEB_CHAIN;
        case ChainID.ENERGY_WEB_CHAIN_TESTNET:
            return Explorer.ENERGY_WEB_CHAIN_TESTNET;
        case ChainID.LUKSO_MAINNET:
            return Explorer.LUKSO_MAINNET;
        case ChainID.LUKSO_TESTNET:
            return Explorer.LUKSO_TESTNET;
        case ChainID.ACALA_MAINNET:
            return Explorer.ACALA_MAINNET;
        case ChainID.MANDALA_TESTNET:
            return Explorer.MANDALA_TESTNET;
        case ChainID.REI_MAINNET:
            return Explorer.REI_MAINNET;
        case ChainID.REI_TESTNET:
            return Explorer.REI_TESTNET;
        case ChainID.ZORA_NETWORK_MAINNET:
            return Explorer.ZORA_NETWORK_MAINNET;
        case ChainID.CALLISTO_MAINNET:
            return Explorer.CALLISTO_MAINNET;
        case ChainID.ZKSYNC_MAINNET:
            return Explorer.ZKSYNC_MAINNET;
        case ChainID.ZKSYNC_SEPOLIA:
            return Explorer.ZKSYNC_SEPOLIA;
        case ChainID.NEON_MAINNET:
            return Explorer.NEON_MAINNET;
        case ChainID.NEON_TESTNET:
            return Explorer.NEON_TESTNET;
        case ChainID.AURORA_MAINNET:
            return Explorer.AURORA_MAINNET;
        case ChainID.AURORA_TESTNET:
            return Explorer.AURORA_TESTNET;
        case ChainID.RONIN_MAINNET:
            return Explorer.RONIN_MAINNET;
        case ChainID.RONIN_SAIGON_TESTNET:
            return Explorer.RONIN_SAIGON_TESTNET;
        case ChainID.TRON_MAINNET:
            return Explorer.TRON_MAINNET;
        case ChainID.TRON_SHASTA_TESTNET:
            return Explorer.TRON_SHASTA_TESTNET;
        case ChainID.BEAM_MAINNET:
            return Explorer.BEAM_MAINNET;
        case ChainID.CARBON_EVM_MAINNET:
            return Explorer.CARBON_EVM_MAINNET;
        case ChainID.CARBON_EVM_TESTNET:
            return Explorer.CARBON_EVM_TESTNET;
        default:
            return "";
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
    ASTAR_MAINNET = 'https://astar.blockscout.com',  // "https://blockscout.com/astar",
    SHIDEN_MAINNET = 'https://shiden.blockscout.com',
    SHUBIYA_TESTNET = 'https://shibuya.blockscout.com',
    ZETACHAIN_MAINNET = '',
    ZETACHAIN_TESTNET = 'https://zetachain-athens-3.blockscout.com',
    FLARE_MAINNET = 'https://flare-explorer.flare.network',
    FLARE_COSTON = 'https://coston-explorer.flare.network',
    FLARE_COSTON2 = 'https://coston2-explorer.flare.network',
    FUSE_MAINNET = 'https://explorer.fuse.io',
    FUSE_SPARK = 'https://explorer.fusespark.io',
    SHIBARIUM_MAINNET = 'https://www.shibariumscan.io',
    PUPPYNET_TESTNET = 'https://puppyscan.shib.io',
    CONFLUX_MAINNET = 'https://evm.confluxscan.io',
    CONFLUX_TESTNET = 'https://evmtestnet.confluxscan.net',
    FILECOIN_MAINNET = 'https://fvm.starboard.ventures/explorer',
    FILECOIN_CALIBRATION = 'https://fvm.starboard.ventures/calibration/explorer',
    ENERGY_WEB_CHAIN = 'https://explorer.energyweb.org',
    ENERGY_WEB_CHAIN_TESTNET = 'https://explorer.testnet.energyweb.org',

    LUKSO_MAINNET = 'https://explorer.execution.mainnet.lukso.network',
    LUKSO_TESTNET = 'https://explorer.execution.testnet.lukso.network',
    ACALA_MAINNET = 'https://blockscout.acala.network',
    MANDALA_TESTNET = 'https://blockscout.mandala.aca-staging.network',
    REI_MAINNET = 'https://scan.rei.network',
    REI_TESTNET = 'https://scan-test.rei.network',
    ZORA_NETWORK_MAINNET = 'https://explorer.zora.energy',
    CALLISTO_MAINNET = 'https://explorer.callisto.network',
    ZKSYNC_MAINNET = 'https://explorer.zksync.io',
    ZKSYNC_SEPOLIA = 'https://sepolia.explorer.zksync.io',
    NEON_MAINNET = 'https://neon.blockscout.com',
    NEON_TESTNET = 'https://neon-devnet.blockscout.com',
    AURORA_MAINNET = 'https://explorer.mainnet.aurora.dev',
    AURORA_TESTNET = 'https://explorer.testnet.aurora.dev',
    RONIN_MAINNET = 'https://app.roninchain.com',
    RONIN_SAIGON_TESTNET = 'https://saigon-app.roninchain.com',
    TRON_MAINNET = 'https://tronscan.org/#',
    TRON_SHASTA_TESTNET = 'https://shasta.tronscan.org/#',
    BEAM_MAINNET = 'https://avascan.info/blockchain/beam',
    CARBON_EVM_MAINNET = 'https://evm-scan.carbon.network',
    CARBON_EVM_TESTNET = 'https://test-evm-scan.carbon.network',
}