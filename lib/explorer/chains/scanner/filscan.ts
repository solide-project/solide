import path from "path"

import { getAPI, getAPIKey } from "@/lib/chains"
import { ContractDependency } from "@/lib/interfaces"
import { ContractPaths } from "@/lib/solide/contract-paths"
import { solcVersion } from "@/lib/utils"
import { compilerVersions } from "@/lib/versions"

import { ExplorerInterface } from "../explorer-interface"
import {
  generateSourceCodeError,
  getSourceCodeEndpoint,
} from "../get-source-code"
import { EthGetSourceCodeInterface } from "../get-source-code-interface"
import { BaseScan } from "./base"

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

    sourceInput.sources = await this.fetchSources(data.data.source_codes)

    // Same implementation as blockscout's explorer that uses sourcify except here the metadata is available in API
    const sourifyData = JSON.parse(data.data.metadata)

    if (sourifyData.sources) {
      // We not use this but this is an alternative to get source code
      // try {
      //   const sources: any = await this.metadataGetSources(sourifyData)
      //   sourceInput.sources = sources
      // } catch (error) {
      //   return generateSourceCodeError("Error loading contract")
      // }

      results.SourceCode = `{${JSON.stringify(sourceInput)}}`
      results.ABI = JSON.stringify(sourifyData.output?.abi || {})

      if (sourifyData.settings) {
        if (sourifyData.settings.compilationTarget) {
          // Since API doesn't provide the contract name we can just get it from the compilationTarget
          results.ContractName =
            Object.keys(sourifyData.settings.compilationTarget).pop() || ""

          // We take the value of the key as Contract Name
          if (results.ContractName) {
            results.ContractName =
              sourifyData.settings.compilationTarget[results.ContractName]
          }

          results.ContractName = this.appendExtension(results.ContractName)

          delete sourifyData.settings.compilationTarget
        }

        if (sourifyData.settings.libraries) {
          delete sourifyData.settings.libraries
        }

        sourceInput.settings = sourifyData.settings
      }

      if (sourifyData.language) {
        results.Language = sourifyData.language
      }

      if (sourifyData.compiler?.version) {
        // Found a valid version as per sourcify can just be a version number
        const compilerVersion = compilerVersions.find((element: string) =>
          element.includes(sourifyData.compiler.version)
        )
        results.CompilerVersion = compilerVersion || solcVersion // Fall back to default if not found
      }

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
