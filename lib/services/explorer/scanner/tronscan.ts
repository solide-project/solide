import { BaseScan } from "@/lib/services/explorer/scanner/base"
import {
  generateSourceCodeError, ContractInfo, EthGetSourceCodeInterface, ExplorerInterface
} from "@/lib/services/explorer/scanner/explorer-service"

export const isTronAddress = (address: string): boolean =>
  address.substring(0, 1) === "T" && address.length === 34

export class TronScanClient extends BaseScan implements ExplorerInterface {
  private headers: Headers

  constructor(chainId: string) {
    super(chainId)

    this.headers = new Headers()
    this.headers.append("Content-Type", "application/json")
  }

  getSourceCodeEndpoint(address: string): string {
    return ``
  }

  async getSourceCode(address: string): Promise<EthGetSourceCodeInterface> {
    const apiUrl: string = this.getsourcecodeURL(address)
    if (!apiUrl) {
      return generateSourceCodeError("API Endpoint not found")
    }

    var body = JSON.stringify({ contractAddress: address })
    var requestOptions: any = {
      method: "POST",
      headers: this.headers,
      body: body,
      redirect: "follow",
    }

    const response = await fetch(apiUrl, requestOptions)
    if (!response || !response.ok) {
      return generateSourceCodeError("Error fetching contract")
    }

    return await this.convert(await response.json(), address)
  }

  isTronAddress(address: string): boolean {
    return isTronAddress(address)
  }

  async convert(
    data: any,
    address: string
  ): Promise<EthGetSourceCodeInterface> {
    if (data.errmsg || !data.data) {
      return generateSourceCodeError(data.errmsg || "Error loading contract")
    }

    let results: any = this.generateDefaultResult()
    let sourceInput: any = {
      sources: {},
    };

    results.SourceCode = ''
    if (data.data?.contract_code) {
      data.data?.contract_code.forEach((element: any) => {
        sourceInput.sources[element.name] = {
          content: atob(element.code),
        }
      })
      results.SourceCode = `{${JSON.stringify(sourceInput)}}`
    }

    results.ABI = data.data.abi || ""
    results.OptimizationUsed = data.data.optimizer || "0"
    results.Runs = data.data.optimizer_runs || "0"
    results.LicenseType = data.data.license || "0"
    const match = (data.data.compiler || "").match(/tron-(\d+\.\d+\.\d+)/)
    const versionNumber = match ? match[1] : null
    results.CompilerVersion = this.formatVersion(versionNumber)
    results.ContractName = this.appendExtension(data.data.contract_name || "")

    return {
      status: "1",
      message: "OK",
      result: [results],
    }
  }
}
