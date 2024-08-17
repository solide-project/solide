import { defineChain, PublicClient } from "viem";

import { getExplorer, getNetworkNameFromChainID, getRPC } from "../chains";
import { getNativeCurrency } from "./native-currency";

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
            default: { name: 'Explorer', url: getExplorer(chainId) },
        },
    })
}