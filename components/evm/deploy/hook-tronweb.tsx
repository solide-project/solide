import { useState } from "react"

import { deploy, load } from "@/lib/tron"

export const useTronHook = () => {
  const [contract, setContract] = useState<any | null>(null)

  const executeSend = async (
    method: string,
    args: any[],
    value: number = 0
  ) => {
    // const options: any = {}
    // if (value !== "0") {
    //     options.value = ethers.parseEther(value);
    // }
    return contract[method](...args).send({})
  }

  const executeCall = async (method: string, args: any[] = []) => {
    return contract[method](...args).call()
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
      const contract = await load(abi, contractAddress)

      if (contract) {
        setContract(contract)
      }
      return {
        contract,
        transactionHash: "",
      }
    }

    return await deploy(abi, bytecode, args, name)
  }

  return {
    contract,
    setContract,
    executeSend,
    executeCall,
    doDeploy,
  }
}
