import { ChainID } from "./chain-id"

const data: { [key: string]: string } = {
    [ChainID.ETHEREUM_MAINNET]: "https://eth.llamarpc.com",
    [ChainID.FANTOM_TESTNET]: "https://rpc.testnet.fantom.network",
    [ChainID.POLYGON_MUMBAI]: "https://rpc.ankr.com/polygon_mumbai",
    [ChainID.BITTORRENT_MAINNET]: "https://rpc.bt.io",
    [ChainID.BITTORRENT_TESTNET]: "https://pre-rpc.bt.io",
}

export const getRPC = (network: string): string =>
    data[network] || ""
