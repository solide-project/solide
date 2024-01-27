import { EthGetSourceCodeInterface, ExplorerInterface } from "../chains"
import { getScanner } from "../chains/get-scanner"
import { generateSourceCodeError } from "../chains/get-source-code"

export const getSourceCode = async (
  chain: string,
  address: string
): Promise<EthGetSourceCodeInterface> => {
  const scanner: ExplorerInterface | undefined = getScanner(chain)
  if (!scanner) {
    return generateSourceCodeError("Invalid chain or chain not supported")
  }

  return await scanner.getSourceCode(address)
}
