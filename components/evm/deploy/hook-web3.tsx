import { useState } from "react"
import { formatUnits } from "ethers"
import { Contract } from "web3"

import { deploy, load } from "@/lib/evm/ethers"

export const useWeb3Hook = () => {
  const [contract, setContract] = useState<Contract<any> | null>(null)

  const executeSend = async (
    method: string,
    args: any[],
    value: number = 0
  ) => {
    const accounts: string[] = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    const account = accounts[0]

    if (!account) {
      throw new Error("No account found")
    }

    const options: any = {
      from: account,
      gas: "1000000",
      gasPrice: "1000000000",
    }
    if (value > 0) {
      options.value = value // formatUnits(value, "wei")
    }

    if (!contract) {
      throw new Error("Contract not loaded")
    }

    const receipt = await contract.methods[method](...args).send(options)

    return { receipt }
  }

  const executeCall = async (method: string, args: any[]) => {
    if (!contract) {
      throw new Error("Contract not loaded")
    }

    console.log("Calling", method, args)
    return contract.methods[method](...args).call()
  }

  const doDeploy = async ({
    contractAddress,
    abi,
    bytecode,
    args = [],
  }: {
    contractAddress?: string
    abi: any[]
    bytecode: string
    args: any[]
  }) => {
    if (contractAddress) {
      const contract = await load(contractAddress, abi)

      if (contract) {
        setContract(contract)
      }
      return {
        contract,
        transactionHash: "",
      }
    }

    return await deploy(abi, bytecode, args)
  }

  return {
    contract,
    setContract,
    executeCall,
    executeSend,
    doDeploy,
  }
}
