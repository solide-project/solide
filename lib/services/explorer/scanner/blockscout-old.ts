import { BaseScan } from "@/lib/services/explorer/scanner/base"
import {
  generateSourceCodeError, ContractInfo, EthGetSourceCodeInterface, ExplorerInterface
} from "@/lib/services/explorer/scanner/explorer-service"
import { ethers } from "ethers"

export class BlockScoutOldClient extends BaseScan implements ExplorerInterface {
  constructor(chainId: string) {
    super(chainId)
  }

  async getSourceCode(address: string): Promise<EthGetSourceCodeInterface> {
    let data: EthGetSourceCodeInterface = await this.call(address)
    if (data.status === "0") {
      return data
    }

    const result = data.result[0] as any;
    if (ethers.isAddress(result.ImplementationAddress)) {
      data = await this.call(result.ImplementationAddress)
      // return data;
    }

    return await this.convert(data, address)
  }

  async convert(
    data: any,
    address: string
  ): Promise<EthGetSourceCodeInterface> {
    if (data.result && data.result[0]) {
      if (!data.result[0].SourceCode) {
        return generateSourceCodeError("Contract source code not verified")
      }
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
