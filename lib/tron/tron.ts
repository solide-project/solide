import TronWeb from "tronweb"

export const deploy = async ({
  contract,
  parameters,
  name,
}: {
  contract: any
  parameters: any[]
  name: string
}) => {
  const tx = await window.tronWeb.transactionBuilder.createSmartContract(
    {
      feeLimit: 1000000000,
      callValue: 0,
      userFeePercentage: 100,
      originEnergyLimit: 10000000,
      abi: JSON.stringify(contract.abi),
      bytecode: contract.evm.bytecode.object,
      parameters,
      name,
    },
    window.tronWeb.defaultAddress.hex
  )

  const signedTx = await window.tronWeb.trx.sign(tx)
  await window.tronWeb.trx.sendRawTransaction(signedTx)

  const transactionInfo = await window.tronWeb.trx.getTransaction(signedTx.txID)
  const address = TronWeb.address.fromHex(transactionInfo.contract_address)

  return {
    address,
  }
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

export const getCode = async (
  address: string,
  rpc: string
): Promise<string> => {
  const tronWeb = new TronWeb({
    fullHost: rpc,
  })
  let evmAddress: string = tronWeb.address.toHex(address)
  if (evmAddress && evmAddress.startsWith("41")) {
    evmAddress = evmAddress.replace("41", "0x")
  }

  const myHeaders = new Headers()
  myHeaders.append("Content-Type", "application/json")

  const raw = JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_getCode",
    params: [evmAddress, "latest"],
    id: 64,
  })

  const response = await fetch(`${rpc}/jsonrpc`, {
    method: "POST",
    headers: myHeaders,
    body: raw,
  })

  const data = await response.json()
  return data.result
}
