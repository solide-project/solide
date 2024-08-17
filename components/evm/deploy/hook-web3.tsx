import { useState } from "react"

import { deploy } from "@/lib/evm/ethers"
import { DeployedContracts } from "@/lib/eth/interfaces"
import { EVMSmartContract } from "@/lib/eth/evm"
import { getAddress } from 'viem'

export const useWeb3Hook = () => {
  const [contracts, setContracts] = useState<DeployedContracts>({})

  const executeSend = async (
    contractAddress: string,
    method: string,
    args: any[],
    value: number = 0
  ) => {
    contractAddress = getAddress(contractAddress)
    if (!contracts.hasOwnProperty(contractAddress)) {
      throw new Error("Contract not loaded")
    }

    return contracts[contractAddress].send({ method, args, value: value.toString() })
  }

  const executeCall = async (contractAddress: string, method: string, args: any[]) => {
    contractAddress = getAddress(contractAddress)
    if (!contracts.hasOwnProperty(contractAddress)) {
      throw new Error("Contract not loaded")
    }

    return contracts[contractAddress].call({ method, args })
  }

  const removeContract = (contractAddress: string) => {
    contractAddress = getAddress(contractAddress)
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
  }: {
    contractAddress?: string
    abi: any[]
    bytecode: string
    args: any[]
  }) => {
    if (contractAddress) {
      contractAddress = getAddress(contractAddress)
      setContracts({
        ...contracts,
        [contractAddress]: new EVMSmartContract(contractAddress, abi),
      })
      return { contract: contractAddress, transactionHash: "" };
    }

    console.log("Deploying contract", abi, bytecode, args)
    const result = await deploy(abi, bytecode, args)
    contractAddress = result.contract as string
    setContracts({
      ...contracts,
      [getAddress(contractAddress)]: new EVMSmartContract(contractAddress, abi)
    })
    return result
  }

  return {
    executeCall,
    executeSend,
    doDeploy,

    contracts,
    removeContract
  }
}
