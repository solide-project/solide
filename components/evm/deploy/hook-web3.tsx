import { useState } from "react"
import { Contract, utils } from "web3"

import { deploy, load } from "@/lib/evm/ethers"

export const useWeb3Hook = () => {
  const [contract, setContract] = useState<Contract<any> | null>(null)

  const executeSend = async (
    method: string,
    args: any[],
    value: number = 0
  ) => {
    const options: any = {}
    if (value > 0) {
      options.value = utils.fromWei(value, "wei")
    }

    if (!contract) {
      throw new Error("Contract not loaded")
    }

    const accounts: string[] = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    const account = accounts[0]

    if (!account) {
      throw new Error("No account found")
    }

    const receipt = await contract.methods[method](...args).send({
      from: account,
      gas: '1000000',
      gasPrice: '1000000000',
    })

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
    console.log("Loading contract", abi, contractAddress)

    if (contractAddress) {
      console.log("Loading contract", abi, contractAddress)
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
