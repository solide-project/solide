import TronWeb from "tronweb"

import { ChainID, getTronRPC } from "@/lib/chains"

import { abi, address } from "./metadata"

export class SolidityDatabaseRegistry {
  tronWeb: any
  contract: any

  constructor({
    rpc = getTronRPC(ChainID.TRON_MAINNET),
  }: {
    rpc?: string
  }) {
    this.tronWeb = new TronWeb({
      fullHost: rpc,
      privateKey: process.env.TRON_WALLET,
    })

    this.tronWeb.setAddress("TGNwdiUL8joKM4zcU774qyCvepyDBEo2Zt")
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

  async find(hash: string): Promise<any> {
    return await this.contract.find(hash).call()
  }
}
