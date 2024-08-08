import TronWeb from "tronweb"

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
