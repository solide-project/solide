import { ChainID } from "./chain-id";

export const data: { [key: string]: string } = {
    [ChainID.TRON_NILE_TESTNET]: "https://nile.trongrid.io",
    [ChainID.TRON_MAINNET]: "https://api.trongrid.io",
    [ChainID.TRON_SHASTA_TESTNET]: "https://api.shasta.trongrid.io",
}

export const getTronRPC = (network: string): string =>
    data[network] || ""