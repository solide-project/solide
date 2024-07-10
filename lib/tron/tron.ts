export const deploy = async (
  abi: any,
  bytecode: string,
  args: any[],
  name: string
) => {
  const tx = await window.tronWeb.transactionBuilder.createSmartContract(
    {
      feeLimit: 1000000000,
      callValue: 0,
      userFeePercentage: 100,
      originEnergyLimit: 10000000,
      abi: JSON.stringify(abi),
      bytecode: bytecode,
      parameters: args,
      name,
    },
    window.tronWeb.defaultAddress.hex
  )

  const signedTx = await window.tronWeb.trx.sign(tx)
  await window.tronWeb.trx.sendRawTransaction(signedTx)

  const transactionHash = await window.tronWeb.trx.getTransaction(signedTx.txID)
  const contractAddress = window.tronWeb.trx.tronweb.address.fromHex(transactionHash.contract_address)


  const contract = load(abi, contractAddress)
  return {
    contract,
    transactionHash,
  }
}

export const load = (abi: any, address: string) => {
  // return window.tronWeb.contract(abi, window.tronWeb.address.toHex(address))
  return window.tronWeb.contract(abi, address)
}

export const getContract = (address: string, abi: any) => {
  return window.tronWeb.contract(abi, window.tronWeb.address.toHex(address))
}

export const toEVMAddress = (address: string) => {
  let rand: string = window.tronWeb.address.toHex(address)
  if (rand && rand.startsWith("41")) {
    rand = rand.replace("41", "0x")
  }

  return rand
}

export interface AssetNet {
  key: string;
  value: number;
}

export interface NetworkUsage {
  freeNetUsed: number;
  freeNetLimit: number;
  assetNetUsed: AssetNet[];
  assetNetLimit: AssetNet[];
  TotalNetLimit: number;
  TotalNetWeight: number;
  tronPowerLimit: number;
  EnergyUsed: number;
  EnergyLimit: number;
  TotalEnergyLimit: number;
  TotalEnergyWeight: number;
}