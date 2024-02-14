import { ChainID } from "@/lib/chains"

import { ExplorerInterface } from "./explorer-interface"
import { BlockScoutClient } from "./scanner/blockscout-new"
import { BlockScoutOldClient } from "./scanner/blockscout-old"
import { ConfluxScanClient } from "./scanner/confluxscan"
import { EtherScanClient } from "./scanner/etherscan"
import { FilScanClient } from "./scanner/filscan"
import { RoninChainClient } from "./scanner/roninchain"
import { TronScanClient } from "./scanner/tronscan"
import { XdcScanClient } from "./scanner/xdcscan"
import { VicScanClient } from "./scanner/vicscan"

export const getScanner = (chainId: string): ExplorerInterface | undefined => {
  switch (chainId) {
    case ChainID.METIS_ANDROMEDA:
    case ChainID.METIS_SEPOLIA:
    case ChainID.MANTLE_MAINNET:
    case ChainID.MANTLE_TESTNET:
    case ChainID.KAVA_MAINNET:
    case ChainID.KAVA_TESTNET:
    case ChainID.ROLLUX_MAINNET:
    case ChainID.ROLLUX_TESTNET:
    case ChainID.CANTO_TESTNET:
    case ChainID.ASTAR_MAINNET:
    case ChainID.ACALA_MAINNET:
    case ChainID.MANDALA_TESTNET:
    case ChainID.REI_MAINNET:
    case ChainID.REI_TESTNET:
    case ChainID.CALLISTO_MAINNET:
    case ChainID.OASIS_EMERALD:
    case ChainID.OASIS_SAPPHIRE:
    case ChainID.OASIS_SAPPHIRE_TESTNET:
      return new BlockScoutOldClient(chainId)
    case ChainID.IMMUTABLE_MAINNET:
    case ChainID.IMMUTABLE_TESTNET:
    case ChainID.CANTO_MAINNET:
    case ChainID.MANTA_PACIFIC:
    case ChainID.MANTA_TESTNET:
    // case ChainID.ZETACHAIN_MAINNET:
    case ChainID.ZETACHAIN_TESTNET:
    case ChainID.FUSE_MAINNET:
    case ChainID.FUSE_SPARK:
    // case ChainID.ASTAR_MAINNET:
    // case ChainID.SHIDEN_MAINNET:
    // case ChainID.SHUBIYA_TESTNET:
    case ChainID.LUKSO_MAINNET:
    case ChainID.LUKSO_TESTNET:
    case ChainID.ZORA_NETWORK_MAINNET:
    case ChainID.NEON_MAINNET:
    case ChainID.NEON_TESTNET:
    case ChainID.AURORA_MAINNET:
    case ChainID.AURORA_TESTNET:
      return new BlockScoutClient(chainId)
    case ChainID.XDC_MAINNET:
      return new XdcScanClient(chainId)
    case ChainID.RONIN_MAINNET:
    case ChainID.RONIN_SAIGON_TESTNET:
      return new RoninChainClient(chainId)
    case ChainID.CONFLUX_MAINNET:
    case ChainID.CONFLUX_TESTNET:
      return new ConfluxScanClient(chainId)
    case ChainID.FILECOIN_MAINNET:
    case ChainID.FILECOIN_CALIBRATION:
      return new FilScanClient(chainId)
    case ChainID.TRON_MAINNET:
    case ChainID.TRON_SHASTA_TESTNET:
      return new TronScanClient(chainId)
    case ChainID.VICTION_MAINNET:
    case ChainID.VICTION_TESTNET:
      return new VicScanClient(chainId)
    default:
      return new EtherScanClient(chainId)
  }
}
