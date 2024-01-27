import { getAPI } from "../chains"

export const getABI = async (
  chainId: string,
  contractAddress: string
): Promise<any> => {
  const api = getAPI(chainId)
  const apiUrl = `${api}/api?module=contract&action=getabi&address=${contractAddress}`
  const response = await fetch(apiUrl)
  const data = await response.json()
  console.log(data)
  return null
}
