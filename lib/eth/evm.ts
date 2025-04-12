import { createPublicClient, createWalletClient, custom } from "viem"

import { getNetworkDetails } from "./chains"
import { ISmartContract, InvokeParam } from "./interfaces"
import { BrowserProvider, Contract, Eip1193Provider } from "ethers"

export class EVMSmartContract implements ISmartContract {
  contractAddress: `0x${string}`
  abi: any
  constructor(address: string, abi: any) {
    this.contractAddress = address as `0x${string}`
    this.abi = abi
  }

  async call({ method, args }: InvokeParam): Promise<any> {
    const publicClient = createPublicClient({
      transport: custom(window.ethereum!),
    })

    const data = await publicClient.readContract({
      address: this.contractAddress,
      abi: this.abi,
      functionName: method,
      args: args,
    })

    return data
  }

  /**
   * value in wei
   */
  async send({
    method,
    args,
    value = "0",
    // gas = "1000000",
  }: InvokeParam): Promise<any> {
    const transport = custom(window.ethereum!)
    const chainId = await window.ethereum.request({ method: "eth_chainId" })

    // const publicClient = createPublicClient({ transport })
    // const walletClient = createWalletClient({
    //   chain: getNetworkDetails(parseInt(chainId, 16).toString()),
    //   transport,
    // })
    // const [account] = await walletClient.getAddresses()

    // if (!account) {
    //   throw new Error("No account found")
    // }

    // // const gas = await publicClient.estimateContractGas({
    // //   address: this.contractAddress,
    // //   abi: this.abi,
    // //   functionName: method,
    // //   args: args,
    // //   value: BigInt(value),
    // //   account,
    // // })

    // const arg = [...args] as const
    // console.log(arg)
    // const { request } = await publicClient.simulateContract({
    //   account,
    //   address: this.contractAddress,
    //   abi: this.abi,
    //   functionName: method,
    //   args: arg,
    //   value: BigInt(value),
    //   // gas,
    // })

    // const hash = await walletClient.writeContract(request)

    // return hash

    const provider = new BrowserProvider(window.ethereum as Eip1193Provider)
    const signer = await provider.getSigner()

    const counter = new Contract(this.contractAddress, this.abi, signer)

    const tx = await counter[method].send(...args)
    const receipt = await tx.wait();

    return receipt?.blockHash
  }
}
