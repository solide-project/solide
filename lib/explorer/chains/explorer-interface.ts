import { EthGetSourceCodeInterface } from "./get-source-code-interface"

export interface ExplorerInterface {
  chainId: string
  getSourceCodeEndpoint(address: string): string
  getSourceCode(address: string): Promise<EthGetSourceCodeInterface>
}
