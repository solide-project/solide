import { useState } from "react"

import { DeployedContracts } from "@/lib/eth/interfaces"
import { TronSmartContract, deploy } from "@/lib/eth/tron"

export const useTronHook = () => {
  const [contracts, setContracts] = useState<DeployedContracts>({})

  const executeSend = async (
    contractAddress: string,
    method: string,
    args: any[],
    value: number = 0
  ) => {
    if (!contracts.hasOwnProperty(contractAddress)) {
      throw new Error("Contract not loaded")
    }

    return contracts[contractAddress].send({
      method,
      args,
      value: value.toString(),
    })
  }

  const executeCall = async (
    contractAddress: string,
    method: string,
    args: any[]
  ) => {
    if (!contracts.hasOwnProperty(contractAddress)) {
      throw new Error("Contract not loaded")
    }

    return contracts[contractAddress].call({ method, args })
  }

  const removeContract = (contractAddress: string) => {
    if (contracts.hasOwnProperty(contractAddress)) {
      delete contracts[contractAddress]
      setContracts({ ...contracts })
    }
  }

  const doDeploy = async ({
    contractAddress,
    abi,
    bytecode,
    args = [],
    name,
  }: {
    contractAddress?: string
    abi: any
    bytecode: string
    args: any[]
    name: string
  }) => {
    if (contractAddress) {
      setContracts({
        ...contracts,
        [contractAddress]: new TronSmartContract(contractAddress, abi),
      })
      return { contract: contractAddress, transactionHash: "" }
    }

    const result = await deploy(abi, bytecode, args, name)
    contractAddress = result.contract as string
    setContracts({
      ...contracts,
      [contractAddress]: new TronSmartContract(contractAddress, abi),
    })

    return result
  }

  return {
    executeCall,
    executeSend,
    doDeploy,

    contracts,
    removeContract,
  }
}
