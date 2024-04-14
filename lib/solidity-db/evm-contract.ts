import { ethers } from "ethers"

import { ChainID, getRPC } from "@/lib/chains"

import { abi, address } from "./metadata"

export const rpcUrl = getRPC(
  ChainID.FANTOM_TESTNET || ChainID.BITTORRENT_TESTNET
)

export class SolidityDatabaseRegistry {
  provider: ethers.JsonRpcProvider
  contract: ethers.Contract
  signer: ethers.Wallet | undefined

  constructor({ rpc = rpcUrl }: { rpc?: string }) {
    this.provider = new ethers.JsonRpcProvider(rpc)
    if (process.env.SIGNER_WALLET) {
      const wallet = new ethers.Wallet(process.env.SIGNER_WALLET)
      this.signer = wallet.connect(this.provider)
    }

    this.contract = new ethers.Contract(
      address,
      abi,
      this.signer || this.provider
    )
  }

  async getOwner() {
    return await this.contract.getOwner()
  }

  async add(hash: string, cid: string) {
    return await this.contract.add(hash, cid)
  }

  async adds(hash: string[], cid: string) {
    return await this.contract.adds(hash, cid)
  }

  async find(hash: string): Promise<any> {
    return await this.contract.find(hash)
  }
}
