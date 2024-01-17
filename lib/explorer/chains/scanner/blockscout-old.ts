import { getAPI, getAPIKey } from "@/lib/chains"

import { ExplorerInterface } from "../explorer-interface"
import {
  generateSourceCodeError,
  getSourceCodeEndpoint,
} from "../get-source-code"
import { EthGetSourceCodeInterface } from "../get-source-code-interface"
import { BaseScan } from "./base"

export class BlockScoutOldClient extends BaseScan implements ExplorerInterface {
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

    return await this.convert(await response.json(), address)
  }

  async convert(
    data: any,
    address: string
  ): Promise<EthGetSourceCodeInterface> {
    if (data.result && data.result[0]) {
      if (data.result[0].AdditionalSources) {
        let sources: any = {}

        const sourceName =
          data.result[0].FileName || (data.result[0].ContractName as string)
        sources[sourceName] = {
          content: data.result[0].SourceCode as string,
        }
        data.result[0].AdditionalSources.forEach(
          (element: { Filename: string; SourceCode: string }) => {
            if (element.Filename.startsWith("/")) {
              element.Filename = element.Filename.slice(1)
            }

            sources[element.Filename] = {
              content: element.SourceCode,
            }
          }
        )

        if (data.result[0].CompilerSettings) {
          if (data.result[0].CompilerSettings.compilationTarget) {
            delete data.result[0].CompilerSettings.compilationTarget
          }

          if (data.result[0].CompilerSettings.Libraries) {
            delete data.result[0].CompilerSettings.Libraries
          }
        }

        const input: any = {
          settings: data.result[0].CompilerSettings,
          sources: sources,
        }
        input.language = "Solidity"

        data.result[0].SourceCode = `{${JSON.stringify(input)}}`
      }
    }

    return data
  }
}
