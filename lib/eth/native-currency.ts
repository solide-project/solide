import { ChainID } from "../chains"

interface NativeCurrency {
    name: string
    symbol: string
    decimals: number
}

const data: { [key: string]: NativeCurrency } = {
    [ChainID.ETHEREUM_MAINNET]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.ETHEREUM_GOERLI]: {
        "name": "Goerli Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.ETHEREUM_SEPOLIA]: {
        "name": "Sepolia Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.ETHEREUM_HOLESKY]: {
        "name": "Testnet ETH",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.METIS_ANDROMEDA]: {
        "name": "Metis",
        "symbol": "METIS",
        "decimals": 18
    },
    [ChainID.METIS_SEPOLIA]: {
        "name": "tMetis",
        "symbol": "tMETIS",
        "decimals": 18
    },
    [ChainID.ARBITRUM_ONE]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.ARBITRUM_GOERLI]: {
        "name": "Arbitrum Goerli Ether",
        "symbol": "AGOR",
        "decimals": 18
    },
    [ChainID.ARBITRUM_NOVA]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.OASIS_EMERALD]: {
        "name": "Emerald Rose",
        "symbol": "ROSE",
        "decimals": 18
    },
    [ChainID.OASIS_SAPPHIRE]: {
        "name": "Sapphire Rose",
        "symbol": "ROSE",
        "decimals": 18
    },
    [ChainID.OASIS_SAPPHIRE_TESTNET]: {
        "name": "Sapphire Test Rose",
        "symbol": "TEST",
        "decimals": 18
    },
    [ChainID.IMMUTABLE_MAINNET]: {
        "name": "IMX",
        "symbol": "IMX",
        "decimals": 18
    },
    [ChainID.IMMUTABLE_TESTNET]: {
        "name": "Test IMX",
        "symbol": "tIMX",
        "decimals": 18
    },
    [ChainID.AVALANCHE_MAINNET]: {
        "name": "Avalanche",
        "symbol": "AVAX",
        "decimals": 18
    },
    [ChainID.AVALANCHE_FUJI]: {
        "name": "Avalanche",
        "symbol": "AVAX",
        "decimals": 18
    },
    [ChainID.POLYGON_MAINNET]: {
        "name": "MATIC",
        "symbol": "MATIC",
        "decimals": 18
    },
    [ChainID.POLYGON_MUMBAI]: {
        "name": "MATIC",
        "symbol": "MATIC",
        "decimals": 18
    },
    [ChainID.OPTIMISM_MAINNET]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.OPTIMISM_SEPOLIA]: {
        "name": "Sepolia Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.FANTOM_MAINNET]: {
        "name": "Fantom",
        "symbol": "FTM",
        "decimals": 18
    },
    [ChainID.FANTOM_TESTNET]: {
        "name": "Fantom",
        "symbol": "FTM",
        "decimals": 18
    },
    [ChainID.BASE_MAINNET]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.BASE_SEPOLIA]: {
        "name": "Sepolia Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.BNB_MAINNET]: {
        "name": "BNB Chain Native Token",
        "symbol": "BNB",
        "decimals": 18
    },
    [ChainID.BNB_TESTNET]: {
        "name": "BNB Chain Native Token",
        "symbol": "tBNB",
        "decimals": 18
    },
    [ChainID.LINEA_MAINNET]: {
        "name": "Linea Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.LINEA_TESTNET]: {
        "name": "Linea Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.MOONBEAM_MAINNET]: {
        "name": "Glimmer",
        "symbol": "GLMR",
        "decimals": 18
    },
    [ChainID.MOONBASE_ALPHA]: {
        "name": "Dev",
        "symbol": "DEV",
        "decimals": 18
    },
    [ChainID.MOONRIVER_MAINNET]: {
        "name": "Moonriver",
        "symbol": "MOVR",
        "decimals": 18
    },
    [ChainID.CELO_MAINNET]: {
        "name": "CELO",
        "symbol": "CELO",
        "decimals": 18
    },
    [ChainID.CELO_ALFAJORES]: {
        "name": "CELO",
        "symbol": "CELO",
        "decimals": 18
    },
    [ChainID.GNOSIS_MAINNET]: {
        "name": "xDAI",
        "symbol": "XDAI",
        "decimals": 18
    },
    [ChainID.CRONOS_MAINNET]: {
        "name": "Cronos",
        "symbol": "CRO",
        "decimals": 18
    },
    [ChainID.SCROLL_MAINNET]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.SCROLL_SEPOLIA]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.MANTLE_MAINNET]: {
        "name": "Mantle",
        "symbol": "MNT",
        "decimals": 18
    },
    [ChainID.MANTLE_TESTNET]: {
        "name": "Testnet Mantle",
        "symbol": "MNT",
        "decimals": 18
    },
    [ChainID.BITTORRENT_MAINNET]: {
        "name": "BitTorrent",
        "symbol": "BTT",
        "decimals": 18
    },
    [ChainID.BITTORRENT_TESTNET]: {
        "name": "BitTorrent",
        "symbol": "BTT",
        "decimals": 18
    },
    [ChainID.XDC_MAINNET]: {
        "name": "XinFin",
        "symbol": "XDC",
        "decimals": 18
    },
    [ChainID.CANTO_MAINNET]: {
        "name": "Canto",
        "symbol": "CANTO",
        "decimals": 18
    },
    [ChainID.CANTO_TESTNET]: {
        "name": "Testnet Canto",
        "symbol": "CANTO",
        "decimals": 18
    },
    [ChainID.KAVA_MAINNET]: {
        "name": "Kava",
        "symbol": "KAVA",
        "decimals": 18
    },
    [ChainID.KAVA_TESTNET]: {
        "name": "TKava",
        "symbol": "TKAVA",
        "decimals": 18
    },
    [ChainID.ROLLUX_MAINNET]: {
        "name": "Syscoin",
        "symbol": "SYS",
        "decimals": 18
    },
    [ChainID.ROLLUX_TESTNET]: {
        "name": "Testnet Syscoin",
        "symbol": "TSYS",
        "decimals": 18
    },
    [ChainID.SYSCOIN_MAINNET]: {
        "name": "Syscoin",
        "symbol": "SYS",
        "decimals": 18
    },
    [ChainID.SYSCOIN_TESTNET]: {
        "name": "Testnet Syscoin",
        "symbol": "tSYS",
        "decimals": 18
    },
    [ChainID.BOBA_ETHEREUM]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.MANTA_PACIFIC]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.MANTA_TESTNET]: {
        "name": "Manta",
        "symbol": "MANTA",
        "decimals": 18
    },
    [ChainID.WEMIX_MAINNET]: {
        "name": "WEMIX",
        "symbol": "WEMIX",
        "decimals": 18
    },
    [ChainID.WEMIX_TESTNET]: {
        "name": "TestnetWEMIX",
        "symbol": "tWEMIX",
        "decimals": 18
    },
    [ChainID.ASTAR_MAINNET]: {
        "name": "Astar",
        "symbol": "ASTR",
        "decimals": 18
    },
    [ChainID.SHIDEN_MAINNET]: {
        "name": "Shiden",
        "symbol": "SDN",
        "decimals": 18
    },
    [ChainID.SHUBIYA_TESTNET]: {
        "name": "Japan Open Chain Token",
        "symbol": "JOC",
        "decimals": 18
    },
    [ChainID.ZETACHAIN_MAINNET]: {
        "name": "Zeta",
        "symbol": "ZETA",
        "decimals": 18
    },
    [ChainID.ZETACHAIN_TESTNET]: {
        "name": "Zeta",
        "symbol": "ZETA",
        "decimals": 18
    },
    [ChainID.FLARE_MAINNET]: {
        "name": "Flare",
        "symbol": "FLR",
        "decimals": 18
    },
    [ChainID.FLARE_COSTON]: {
        "name": "Coston Flare",
        "symbol": "CFLR",
        "decimals": 18
    },
    [ChainID.FLARE_COSTON2]: {
        "name": "Coston2 Flare",
        "symbol": "C2FLR",
        "decimals": 18
    },
    [ChainID.FUSE_MAINNET]: {
        "name": "Fuse",
        "symbol": "FUSE",
        "decimals": 18
    },
    [ChainID.FUSE_SPARK]: {
        "name": "Spark",
        "symbol": "SPARK",
        "decimals": 18
    },
    [ChainID.SHIBARIUM_MAINNET]: {
        "name": "OEBlock",
        "symbol": "OEB",
        "decimals": 18
    },
    [ChainID.PUPPYNET_TESTNET]: {
        "name": "BONE",
        "symbol": "BONE",
        "decimals": 18
    },
    [ChainID.CONFLUX_MAINNET]: {
        "name": "CFX",
        "symbol": "CFX",
        "decimals": 18
    },
    [ChainID.CONFLUX_TESTNET]: {
        "name": "CFX",
        "symbol": "CFX",
        "decimals": 18
    },
    [ChainID.FILECOIN_MAINNET]: {
        "name": "filecoin",
        "symbol": "FIL",
        "decimals": 18
    },
    [ChainID.FILECOIN_CALIBRATION]: {
        "name": "testnet filecoin",
        "symbol": "tFIL",
        "decimals": 18
    },
    [ChainID.ENERGY_WEB_CHAIN]: {
        "name": "Energy Web Token",
        "symbol": "EWT",
        "decimals": 18
    },
    [ChainID.ENERGY_WEB_CHAIN_TESTNET]: {
        "name": "Volta Token",
        "symbol": "VT",
        "decimals": 18
    },
    [ChainID.LUKSO_MAINNET]: {
        "name": "LUKSO",
        "symbol": "LYX",
        "decimals": 18
    },
    [ChainID.LUKSO_TESTNET]: {
        "name": "TestLYX",
        "symbol": "LYXt",
        "decimals": 18
    },
    [ChainID.ACALA_MAINNET]: {
        "name": "Acala Token",
        "symbol": "ACA",
        "decimals": 18
    },
    [ChainID.MANDALA_TESTNET]: {
        "name": "Acala Mandala Token",
        "symbol": "mACA",
        "decimals": 18
    },
    [ChainID.REI_MAINNET]: {
        "name": "REI",
        "symbol": "REI",
        "decimals": 18
    },
    [ChainID.REI_TESTNET]: {
        "name": "REI",
        "symbol": "tREI",
        "decimals": 18
    },
    [ChainID.ZORA_NETWORK_MAINNET]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.ZORA_NETWORK_TESTNET]: {
        "name": "Sepolia Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.CALLISTO_MAINNET]: {
        "name": "Callisto",
        "symbol": "CLO",
        "decimals": 18
    },
    [ChainID.ZKSYNC_MAINNET]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.ZKSYNC_SEPOLIA]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.NEON_MAINNET]: {
        "name": "Neon",
        "symbol": "NEON",
        "decimals": 18
    },
    [ChainID.NEON_TESTNET]: {
        "name": "Neon",
        "symbol": "NEON",
        "decimals": 18
    },
    [ChainID.AURORA_MAINNET]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.AURORA_TESTNET]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.RONIN_MAINNET]: {
        "name": "USD",
        "symbol": "USD",
        "decimals": 18
    },
    [ChainID.RONIN_SAIGON_TESTNET]: {
        "name": "Edgeware",
        "symbol": "EDG",
        "decimals": 18
    },
    // [ChainID.TRON_MAINNET]: "",
    // [ChainID.TRON_NILE_TESTNET]: "",
    // [ChainID.TRON_SHASTA_TESTNET]: "",
    [ChainID.BEAM_MAINNET]: {
        "name": "Beam",
        "symbol": "BEAM",
        "decimals": 18
    },
    [ChainID.CARBON_EVM_MAINNET]: {
        "name": "swth",
        "symbol": "SWTH",
        "decimals": 18
    },
    [ChainID.CARBON_EVM_TESTNET]: {
        "name": "swth",
        "symbol": "SWTH",
        "decimals": 18
    },
    [ChainID.ARTELA_TESTNET]: {
        "name": "ART",
        "symbol": "ART",
        "decimals": 18
    },
    [ChainID.BERACHAIN_TESTNET]: {
        "name": "BERA Token",
        "symbol": "BERA",
        "decimals": 18
    },
    [ChainID.VICTION_MAINNET]: {
        "name": "Viction",
        "symbol": "VIC",
        "decimals": 18
    },
    [ChainID.VICTION_TESTNET]: {
        "name": "Viction",
        "symbol": "VIC",
        "decimals": 18
    },
    [ChainID.PALM_MAINNET]: {
        "name": "PALM",
        "symbol": "PALM",
        "decimals": 18
    },
    [ChainID.PALM_TESTNET]: {
        "name": "PALM",
        "symbol": "PALM",
        "decimals": 18
    },
    [ChainID.METER_MAINNET]: {
        "name": "Meter",
        "symbol": "MTR",
        "decimals": 18
    },
    [ChainID.METER_TESTNET]: {
        "name": "Meter",
        "symbol": "MTR",
        "decimals": 18
    },
    [ChainID.PUBLIC_GOOD_NETWORK]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.PUBLIC_GOOD_NETWORK_SEPOLIA]: {
        "name": "Sepolia Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.ROOTSTOCK_MAINNET]: {
        "name": "Smart Bitcoin",
        "symbol": "RBTC",
        "decimals": 18
    },
    [ChainID.ROOTSTOCK_TESTNET]: {
        "name": "Testnet Smart Bitcoin",
        "symbol": "tRBTC",
        "decimals": 18
    },
    [ChainID.LIGHTLINK_PHOENIX_MAINNET]: {
        "name": "Ethereum",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.LIGHTLINK_PEGASUS_TESTNET]: {
        "name": "Ethereum",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.ETHERLINK_TESTNET]: {
        "name": "tez",
        "symbol": "XTZ",
        "decimals": 18
    },
    [ChainID.SHARDEUM_SPHINX_1_X]: {
        "name": "Shardeum SHM",
        "symbol": "SHM",
        "decimals": 18
    },
    [ChainID.VELAS_MAINNET]: {
        "name": "Velas",
        "symbol": "VLX",
        "decimals": 18
    },
    [ChainID.MODE_MAINNET]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.MODE_SEPOLIA]: {
        "name": "Sepolia Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.MORPH_TESTNET]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.BLAST_MAINNET]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.BLAST_SEPOLIA]: {
        "name": "Sepolia Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.SYNDICATE_FRAME_MAINNET]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.DOS_MAINNET]: {
        "name": "DOS",
        "symbol": "DOS",
        "decimals": 18
    },
    [ChainID.DOS_TESTNET]: {
        "name": "DOS",
        "symbol": "DOS",
        "decimals": 18
    },
    [ChainID.DEGEN_MAINNET]: {
        "name": "DEGEN",
        "symbol": "DEGEN",
        "decimals": 18
    },
    [ChainID.TAIKO_KATLA_TESTNET]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.SHIMMER_MAINNET]: {
        "name": "SMR",
        "symbol": "SMR",
        "decimals": 18
    },
    [ChainID.SHIMMER_TESTNET]: {
        "name": "SMR",
        "symbol": "SMR",
        "decimals": 18
    },
    [ChainID.FRAXSCAN_MAINNET]: {
        "name": "Frax Ether",
        "symbol": "frxETH",
        "decimals": 18
    },
    [ChainID.FRAXSCAN_TESTNET]: {
        "name": "Frax Ether",
        "symbol": "frxETH",
        "decimals": 18
    },
    [ChainID.XRP_SIDECHAIN]: {
        "name": "XRP",
        "symbol": "XRP",
        "decimals": 18
    },
    [ChainID.CORE_MAINNET]: {
        "name": "Core Blockchain Native Token",
        "symbol": "CORE",
        "decimals": 18
    },
    [ChainID.ZKEVM_POLYGON]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.ZKEVM_POLYGON_CARDONA]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.BITLAYER_MAINNET]: {
        "name": "BTC",
        "symbol": "BTC",
        "decimals": 18
    },
    [ChainID.BITLAYER_TESTNET]: {
        "name": "BTC",
        "symbol": "BTC",
        "decimals": 18
    },
    [ChainID.ETHEREUM_CLASSIC_MAINNET]: {
        "name": "Ether",
        "symbol": "ETC",
        "decimals": 18
    },
    [ChainID.ETHEREUM_CLASSIC_TESTNET]: {
        "name": "Morden Ether",
        "symbol": "TETC",
        "decimals": 18
    },
    [ChainID.STABILITY_MAINNET]: {
        "name": "FREE",
        "symbol": "FREE",
        "decimals": 18
    },
    [ChainID.STABILITY_TESTNET]: {
        "name": "FREE",
        "symbol": "FREE",
        "decimals": 18
    },
    [ChainID.ARBITRUM_SEPOLIA]: {
        "name": "Sepolia Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.KROMA_MAINNET]: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.KROMA_SEPOLIA]: {
        "name": "Sepolia Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    [ChainID.POLYGON_AMOY]: {
        "name": "MATIC",
        "symbol": "MATIC",
        "decimals": 18
    },
    [ChainID.GNOSIS_CHIADO]: {
        "name": "Chiado xDAI",
        "symbol": "XDAI",
        "decimals": 18
    },
    [ChainID.COTI_DEVNET]: {
        "name": "COTI2",
        "symbol": "COTI2",
        "decimals": 18
    },
}

export const getNativeCurrency = (network: string): NativeCurrency => data[network] || ""
