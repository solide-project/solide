/**
 * Assumes web3 is injected
 */

import Web3, { Contract } from "web3"

import { getExplorer } from "../chains"
import { ethers } from "ethers"

export const load = async (contractAddress: string, abi: any[]) => {
  if (!window.ethereum) {
    console.error("No ethereum provider found")
    return
  }
  const contractABI = [...abi] as const
  const web3 = new Web3(window.ethereum)
  return new web3.eth.Contract(contractABI, contractAddress)
}

interface DeployResult {
  contract: Contract<any> | undefined | null
  transactionHash: string
}

/**
 * Note we are using ethers to deploy and create contract instance with web3.
 * Reason is ethers is more stable and has better support for contract deployment, 
 * error such as code can't be store for web3
 * @param abi 
 * @param bytecode 
 * @param args 
 * @returns 
 */
export const deploy = async (
  abi: any,
  bytecode: string,
  args: any[]
): Promise<DeployResult> => {
  const ret: any = {
    contract: null,
    transactionHash: "",
  }
  if (!window.ethereum) {
    console.error("No ethereum provider found")
    return ret
  }

  // Get signer from Metamask
  const accounts: string[] = await window.ethereum.request({
    method: "eth_requestAccounts",
  })
  const account = accounts[0]

  // // Setup web3 and chain info
  const web3 = new Web3(window.ethereum)
  const chainId = await web3.eth.getChainId()

  // const contract = new web3.eth.Contract(abi)

  // // contract.options.data = bytecode;        // Note this is readonly
  // const deployTx = contract.deploy({
  //   data: bytecode,
  //   arguments: args,
  // })
  // const deployedContract = await deployTx
  //   .send({
  //     from: account,
  //     gas: (await deployTx.estimateGas()).toString(),
  //   })
  //   .once("transactionHash", (txhash) => {
  //     const explorer = getExplorer(chainId.toString())
  //     console.log(`Transaction hash: ${explorer} ${txhash}`)
  //     ret.transactionHash = txhash
  //   })

  // console.log(`Contract deployed at ${deployedContract.options.address}`)
  // ret.contract = new web3.eth.Contract(abi, deployedContract.options.address)

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  const factory = new ethers.ContractFactory(
    abi,
    bytecode,
    signer
  )
  const contractInstance: ethers.BaseContract = await factory.deploy(...args);
  const address = await contractInstance.getAddress()

  ret.contract = new web3.eth.Contract(abi, address)

  return ret
}

/**
 * Check if valid Ethereum address or TRON address
 * @param address
 * @returns
 */
export const isAddress = (address: string): boolean =>
  /^(0x)?[0-9a-f]{40}$/i.test(address) || isTronAddress(address)

export const isTronAddress = (address: string): boolean =>
  address.substring(0, 1) === "T" && address.length === 34

