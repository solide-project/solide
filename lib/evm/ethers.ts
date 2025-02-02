/**
 * Assumes window.ethereum is injected
 */

import { BrowserProvider, ContractFactory } from "ethers"


interface DeployResult {
  contract: string | undefined | null
  transactionHash: string
}

export const deploy = async (
  abi: any,
  bytecode: string,
  args: any[]
): Promise<DeployResult> => {
  if (!window.ethereum) {
    console.error("No ethereum provider found")
    return { contract: null, transactionHash: "" }
  }

  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const accounts: string[] = await window.ethereum.request({
    method: "eth_requestAccounts",
  })

  const factory = new ContractFactory(abi, bytecode, signer)

  // const deployTx = await factory.getDeployTransaction(...args)
  // const estimatedGas = await provider.estimateGas(deployTx)
  // console.log("Estimated gas: ", estimatedGas.toString())

  const contractInstance = await factory.deploy(...args)
  const address = await contractInstance.getAddress()
  const hash = await contractInstance.deploymentTransaction()
  await contractInstance.waitForDeployment()

  console.log("Contract deployed at ", hash)
  return {
    contract: address,
    transactionHash: "hash",
  }

  // const accounts: string[] = await window.ethereum.request({
  //   method: "eth_requestAccounts",
  // })
  // const account = accounts[0]

  // // // Setup web3 and chain info
  // const web3 = new Web3(window.ethereum)
  // const chainId = await web3.eth.getChainId()

  // // const contract = new web3.eth.Contract(abi)

  // // // contract.options.data = bytecode;        // Note this is readonly
  // // const deployTx = contract.deploy({
  // //   data: bytecode,
  // //   arguments: args,
  // // })
  // // const deployedContract = await deployTx
  // //   .send({
  // //     from: account,
  // //     gas: (await deployTx.estimateGas()).toString(),
  // //   })
  // //   .once("transactionHash", (txhash) => {
  // //     const explorer = getExplorer(chainId.toString())
  // //     console.log(`Transaction hash: ${explorer} ${txhash}`)
  // //     ret.transactionHash = txhash
  // //   })

  // // console.log(`Contract deployed at ${deployedContract.options.address}`)
  // // ret.contract = new web3.eth.Contract(abi, deployedContract.options.address)

  // const provider = new ethers.BrowserProvider(window.ethereum)
  // const signer = await provider.getSigner()

  // const factory = new ethers.ContractFactory(abi, bytecode, signer)

  // console.log("Deploying contract with args: ", args)

  // // const deployTx = await factory.getDeployTransaction(...args)
  // // const estimatedGas = await provider.estimateGas(deployTx)
  // // console.log("Estimated gas: ", estimatedGas.toString())

  // const contractInstance = await factory.deploy(...args)
  // const address = await contractInstance.getAddress()
  // await contractInstance.waitForDeployment()

  // ret.contract = new web3.eth.Contract(abi, address)
  // return ret
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
