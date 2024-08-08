import TronWeb from "tronweb"

import { ChainID, getTronRPC } from "@/lib/chains"

import { NetworkUsage } from "../tron"
import { abi, account, address } from "./metadata"

export class SolidityDatabaseRegistry {
  tronWeb: any
  contract: any
  public account: string
  public address: string

  constructor({ rpc = getTronRPC(ChainID.TRON_MAINNET) }: { rpc?: string }) {
    this.address = address
    this.account = account
    this.tronWeb = new TronWeb({
      fullHost: rpc,
      privateKey: process.env.TRON_WALLET,
    })

    this.tronWeb.setAddress(account)
  }

  async hasSufficientResource() {
    const result: NetworkUsage = await this.tronWeb.trx.getAccountResources(
      account
    )
    // console.log("Account", result)
    return (
      result.EnergyLimit - result.EnergyUsed >= 4000 &&
      result.TotalNetLimit - result.TotalNetWeight >= 600
    )
  }

  async load() {
    this.contract = await this.tronWeb.contract(abi, address)
  }

  async getOwner() {
    return await this.contract.getOwner().call()
  }

  async add(hash: string, cid: string) {
    return await this.contract.add(hash, cid).send()
  }

  async adds(hash: string[], cid: string) {
    return await this.contract.adds(hash, cid).send()
  }

  async addOverride(hash: string, cid: string) {
    return await this.contract.addOverride(hash, cid).send()
  }

  async find(hash: string): Promise<any> {
    return await this.contract.find(hash).call()
  }
}
