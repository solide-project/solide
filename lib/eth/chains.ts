import { PublicClient, defineChain } from "viem"

import { getExplorer, getNetworkNameFromChainID, getRPC } from "../chains"
import { getNativeCurrency } from "./native-currency"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)
export const hexToString = (hex: string): string => hexToDecimal(hex).toString()

export const getNetworkDetails = (chainId: string) => {
  return defineChain({
    id: parseInt(chainId),
    name: getNetworkNameFromChainID(chainId),
    nativeCurrency: getNativeCurrency(chainId),
    rpcUrls: {
      default: {
        http: [getRPC(chainId)],
      },
    },
    blockExplorers: {
      default: { name: "Explorer", url: getExplorer(chainId) },
    },
  })
}
