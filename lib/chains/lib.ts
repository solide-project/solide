import { data as RPC } from "./rpc"
import { data as NAME } from "./name"
import { data as API } from "./api"
import { data as EXPLORER } from "./explorer"
import { ChainID } from "./chain-id"
import { Explorer } from "./service"

export const getRPC = (network: string): string =>
    RPC[network] || ""

export const getNetworkNameFromChainID = (network: string): string =>
    NAME[network] || ""

export const getAPI = (network: string, explorer?: Explorer): string => {
    const networkData = API[network];

    if (typeof networkData === "object" && networkData !== null) {
        if (explorer) {
            return networkData[explorer.toString()] || "";
        }

        return Object.values(networkData)[0] || "";
    }

    return networkData || "";
};

export const getExplorer = (network: string, explorer?: Explorer): string => {
    const networkData = EXPLORER[network];

    if (typeof networkData === "object" && networkData !== null) {
        if (explorer) {
            return networkData[explorer.toString()] || "";
        }

        return Object.values(networkData)[0] || "";
    }

    return networkData || "";
};
export const getContractExplorer = (network: string, contract: string): string => {
    const explorer = getExplorer(network)
    let addressPath = ""

    switch (network) {
        case ChainID.TRON_MAINNET:
        case ChainID.TRON_SHASTA_TESTNET:
        case ChainID.COTI_DEVNET:
        case ChainID.COTI_TESTNET:
            addressPath = `contract/${contract}`
        case ChainID.PALM_MAINNET:
        case ChainID.PALM_TESTNET:
            addressPath = `contracts/${contract}`
            break
        case ChainID.SHARDEUM_SPHINX_1_X:
            addressPath = `account/${contract}`
            break
        case ChainID.MOVEMENT_IMOLA:
            addressPath = `#/txn/${contract}`
            break
        default:
            addressPath = `address/${contract}`
            break
    }

    return `${explorer}/${addressPath}`
}

export const getTransactionExplorer = (network: string, tx: string): string => {
    const explorer = getExplorer(network)
    if (!explorer) {
        return ""
    }

    let path = ""

    switch (network) {
        case ChainID.TRON_MAINNET:
        case ChainID.TRON_SHASTA_TESTNET:
        case ChainID.COTI_DEVNET:
        case ChainID.COTI_TESTNET:
            path = `transaction/${tx}`
        default:
            path = `tx/${tx}`
            break
    }

    return `${explorer}/${path}`
}
