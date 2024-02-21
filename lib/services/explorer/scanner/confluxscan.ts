import { BaseScan } from "@/lib/services/explorer/scanner/base"
import {
  generateSourceCodeError, ContractInfo, EthGetSourceCodeInterface, ExplorerInterface
} from "@/lib/services/explorer/scanner/explorer-service"


export class ConfluxScanClient extends BaseScan implements ExplorerInterface {
  constructor(chainId: string) {
    super(chainId)
  }

  async getSourceCode(address: string): Promise<EthGetSourceCodeInterface> {
    const apiUrl: string = this.getsourcecodeURL(address)
    if (!apiUrl) {
      return generateSourceCodeError("API Endpoint not found")
    }

    const response = await fetch(apiUrl)
    if (!response || !response.ok) {
      return generateSourceCodeError("Error fetching contract")
    }

    let data = (await response.json()) as EthGetSourceCodeInterface
    if (data.result && data.result[0] && typeof data.result[0] === "object") {
      const compilationTarget = data.result[0].ContractName.split(":")
      data.result[0].ContractName = this.appendExtension(
        compilationTarget[1] || compilationTarget[0]
      )
    }

    return data
  }
}
