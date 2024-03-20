import { BaseScan } from "@/lib/services/explorer/scanner/base"
import {
  generateSourceCodeError, ContractInfo, EthGetSourceCodeInterface, ExplorerInterface
} from "@/lib/services/explorer/scanner/explorer-service"
import { sEthers } from "@/lib/services/ethers"


export class FilScanClient extends BaseScan implements ExplorerInterface {
  constructor(chainId: string) {
    super(chainId)
  }

  getSourceCodeEndpoint(address: string): string {
    return `api/v1/contract/${address}`
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

    return await this.convert(await response.json(), address)
  }

  async convert(
    data: any,
    address: string
  ): Promise<EthGetSourceCodeInterface> {
    if (data.code !== 0 || !data.data) {
      return {
        status: "0",
        message: "NOTOK",
        result: data.message || "Error loading contract",
      }
    }

    let results: any = this.generateDefaultResult()
    let sourceInput: any = {
      sources: {},
    }

    if (!data.data.source_codes || data.data.source_codes.length === 0) {
      return {
        status: "1",
        message: "OK",
        result: [results],
      }
    }

    sourceInput.sources = await this.fetchSources(data.data.source_codes)

    // Same implementation as blockscout's explorer that uses sourcify except here the metadata is available in API
    const metadata = JSON.parse(data.data.metadata)
    if (metadata.sources) {
      // We not use this but this is an alternative to get source code
      // try {
      //   const sources: any = await this.metadataGetSources(metadata)
      //   sourceInput.sources = sources
      // } catch (error) {
      //   return generateSourceCodeError("Error loading contract")
      // }

      results.SourceCode = `{${JSON.stringify(sourceInput)}}`
      results.ABI = sEthers.metadata.abi(metadata)
      results.Language = sEthers.metadata.language(metadata)
      results.ContractName = this.appendExtension(
        sEthers.metadata.contractName(metadata))
      results.CompilerVersion = this.formatVersion(
        sEthers.metadata.compilerVersion(metadata)
      )

      sourceInput.settings = sEthers.metadata.settings(metadata)

      return {
        status: "1",
        message: "OK",
        result: [results],
      }
    }

    return generateSourceCodeError("Error loading contract")
  }

  async fetchSources(files: any[]): Promise<any> {
    const fileContentDict: any = {}

    // Use Promise.all to parallelize the fetching of multiple URLs
    await Promise.all(
      files.map(async (file) => {
        try {
          const response = await fetch(file.code)
          if (response.ok) {
            const content = await response.text()
            fileContentDict[file.file_name] = { content }
          } else {
            console.error(
              `Failed to fetch ${file.file_name}. Status: ${response.status}`
            )
          }
        } catch (error) {
          console.error(`Error fetching ${file.file_name}: ${error}`)
        }
      })
    )

    return fileContentDict
  }
}
