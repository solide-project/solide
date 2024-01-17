import { ChainID } from "@/lib/chains"

import { EthGetSourceCodeInterface } from "."

const BLOCKSCOUNT_NEW = (address: string, chainId: string) =>
  `api/v2/smart-contracts/${address}`
const ETHERSCAN = (address: string, chainId: string) =>
  `api?module=contract&action=getsourcecode&address=${address}`
const BLOCKSSCAN = (address: string, chainId: string) =>
  `api/contracts/${address}`
const FILECON = (address: string, chainId: string) =>
  `api/v1/contract/${address}`
const RONIN = (address: string, chainId: string) =>
  `v2/${chainId}/contract/${address}/src`
const TRON = (address: string, chainId: string) => ""

const data: { [key: string]: Function } = {
  [ChainID.IMMUTABLE_MAINNET]: BLOCKSCOUNT_NEW,
  [ChainID.IMMUTABLE_TESTNET]: BLOCKSCOUNT_NEW,
  [ChainID.CANTO_MAINNET]: BLOCKSCOUNT_NEW,
  [ChainID.MANTA_PACIFIC]: BLOCKSCOUNT_NEW,
  [ChainID.MANTA_TESTNET]: BLOCKSCOUNT_NEW,
  [ChainID.ZETACHAIN_TESTNET]: BLOCKSCOUNT_NEW,
  [ChainID.FUSE_MAINNET]: BLOCKSCOUNT_NEW,
  [ChainID.FUSE_SPARK]: BLOCKSCOUNT_NEW,
  // [ChainID.ASTAR_MAINNET]: BLOCKSCOUNT_NEW,
  // [ChainID.SHIDEN_MAINNET]: BLOCKSCOUNT_NEW,
  // [ChainID.SHUBIYA_TESTNET]: BLOCKSCOUNT_NEW,
  [ChainID.LUKSO_MAINNET]: BLOCKSCOUNT_NEW,
  [ChainID.LUKSO_TESTNET]: BLOCKSCOUNT_NEW,
  [ChainID.ZORA_NETWORK_MAINNET]: BLOCKSCOUNT_NEW,
  [ChainID.NEON_MAINNET]: BLOCKSCOUNT_NEW,
  [ChainID.NEON_TESTNET]: BLOCKSCOUNT_NEW,
  [ChainID.AURORA_MAINNET]: BLOCKSCOUNT_NEW,
  [ChainID.AURORA_TESTNET]: BLOCKSCOUNT_NEW,
  [ChainID.XDC_MAINNET]: BLOCKSSCAN,
  [ChainID.FILECOIN_MAINNET]: FILECON,
  [ChainID.FILECOIN_CALIBRATION]: FILECON,
  [ChainID.RONIN_MAINNET]: RONIN,
  [ChainID.RONIN_SAIGON_TESTNET]: RONIN,
  [ChainID.TRON_MAINNET]: TRON,
  [ChainID.TRON_SHASTA_TESTNET]: TRON,
}

export const getSourceCodeEndpoint = (
  chainId: string,
  address: string
): string => data[chainId](address, chainId) || ETHERSCAN(address, chainId)

export const generateSourceCodeError = (
  ...messages: string[]
): EthGetSourceCodeInterface => ({
  status: "0",
  message: "NOTOK",
  result: messages.join(", "),
})
