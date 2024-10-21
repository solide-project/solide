import { ChainID } from "./chain-id"

export const getAPIKey = (network: string): string => {
  switch (network) {
    case ChainID.ETHEREUM_MAINNET:
    case ChainID.ETHEREUM_GOERLI:
    case ChainID.ETHEREUM_SEPOLIA:
    case ChainID.ETHEREUM_HOLESKY:
      return process.env.ETHERSCAN_API_KEY || ""
    case ChainID.ARBITRUM_ONE:
    case ChainID.ARBITRUM_GOERLI:
    case ChainID.ARBITRUM_SEPOLIA:
      return process.env.ARBISCAN_API_KEY || ""
    case ChainID.ARBITRUM_NOVA:
      return process.env.NOVAARBISCAN_API_KEY || ""
    case ChainID.POLYGON_MAINNET:
    case ChainID.POLYGON_MUMBAI:
    case ChainID.POLYGON_AMOY:
      return process.env.POLYGONSCAN_API_KEY || ""
    case ChainID.OPTIMISM_MAINNET:
    case ChainID.OPTIMISM_SEPOLIA:
      return process.env.OPTIMISTICSCAN_API_KEY || ""
    case ChainID.FANTOM_MAINNET:
    case ChainID.FANTOM_TESTNET:
      return process.env.FTMSCAN_API_KEY || ""
    case ChainID.BASE_MAINNET:
    case ChainID.BASE_SEPOLIA:
      return process.env.BASESCAN_API_KEY || ""
    case ChainID.BNB_MAINNET:
    case ChainID.BNB_TESTNET:
      return process.env.BSCSCAN_API_KEY || ""
    case ChainID.LINEA_MAINNET:
    case ChainID.LINEA_TESTNET:
      return process.env.LINEASCAN_API_KEY || ""
    case ChainID.MOONBEAM_MAINNET:
    case ChainID.MOONBASE_ALPHA:
      return process.env.MOONBEAM_API_KEY || ""
    case ChainID.MOONRIVER_MAINNET:
      return process.env.MOONRIVER_API_KEY || ""
    case ChainID.CELO_MAINNET:
    case ChainID.CELO_ALFAJORES:
      return process.env.CELOSCAN_API_KEY || ""
    case ChainID.GNOSIS_MAINNET:
    case ChainID.GNOSIS_CHIADO:
      return process.env.GNOSISSCAN_API_KEY || ""
    case ChainID.CRONOS_MAINNET:
      return process.env.CRONOSCAN_API_KEY || ""
    case ChainID.SCROLL_MAINNET:
    case ChainID.SCROLL_SEPOLIA:
      return process.env.SCROLLSCAN_API_KEY || ""
    case ChainID.BITTORRENT_MAINNET:
    case ChainID.BITTORRENT_TESTNET:
      return process.env.BTTCSCAN_API_KEY || ""
    case ChainID.WEMIX_MAINNET:
    case ChainID.WEMIX_TESTNET:
      return process.env.WEMIXSCAN_API_KEY || ""
    case ChainID.BLAST_MAINNET:
    case ChainID.BLAST_SEPOLIA:
      return process.env.BLASTSCAN_API_KEY || ""
    case ChainID.FRAXSCAN_MAINNET:
    case ChainID.FRAXSCAN_TESTNET:
      return process.env.FRAXSCAN_API_KEY || ""
    case ChainID.ZKEVM_POLYGON:
    case ChainID.ZKEVM_POLYGON_CARDONA:
      return process.env.ZKEVM_POLYSCAN_API_KEY || ""
    case ChainID.KROMA_MAINNET:
    case ChainID.KROMA_SEPOLIA:
      return process.env.KROMA_API_KEY || ""
    case ChainID.UNICHAIN_SEPOLIA:
      return process.env.UNICHAIN_API_KEY || ""
    case ChainID.TAIKO_MAINNET:
    case ChainID.TAIKO_KATLA_TESTNET:
      return process.env.TAIKOSCAN_API_KEY || ""
    case ChainID.XAI_GAMES_MAINNET:
    case ChainID.XAI_ARB_TESTNET:
      return process.env.XAISCAN_API_KEY || ""
    case ChainID.APECHAIN_MAINNET:
    case ChainID.APECHAIN_CURTIS_TESTNET:
      return process.env.APESCAN_API_KEY || ""
    default:
      return ""
  }
}