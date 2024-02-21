import { getAPI } from "@/lib/chains"
import { BaseScan } from "./base"
import {
  generateSourceCodeError, ContractInfo, EthGetSourceCodeInterface, ExplorerInterface
} from "@/lib/services/explorer/scanner/explorer-service"

interface SourceElement {
  file_path: string
  source_code: string
}

export class BlockScoutClient extends BaseScan implements ExplorerInterface {
  constructor(chainId: string) {
    super(chainId)
  }

  getSourceCodeEndpoint(address: string): string {
    return `api/v2/smart-contracts/${address}`
  }

  async contractImplmentation(address: string): Promise<string> {
    const apiUrl: string = getAPI(this.chainId)
    if (!apiUrl) {
      return ""
    }

    const uri = `${apiUrl}/api/v2/addresses/${address}`
    const response = await fetch(uri)
    if (!response || !response.ok) {
      return ""
    }

    const data = await response.json()
    return data.implementation_address || ""
  }

  async getSourceCode(address: string): Promise<EthGetSourceCodeInterface> {
    const implementation = await this.contractImplmentation(address) || address;
    const apiUrl: string = this.getsourcecodeURL(implementation)
    if (!apiUrl) {
      return generateSourceCodeError("API Endpoint not found")
    }

    const response = await fetch(apiUrl)
    if (!response || !response.ok) {
      return generateSourceCodeError("Error fetching contract")
    }

    return await this.convert(await response.json(), address)
  }

  generateSources(data: SourceElement[]): any {
    const sources: Record<string, { content: string }> = {}
    if (!data) return sources

    for (const { file_path, source_code } of data) {
      const normalizedFilePath = file_path.startsWith("/")
        ? file_path.slice(1)
        : file_path

      sources[normalizedFilePath] = {
        content: source_code,
      }
    }

    return sources
  }

  async convert(
    data: any,
    address: string
  ): Promise<EthGetSourceCodeInterface> {
    if (data.errors || !data.abi) {
      return generateSourceCodeError("Error loading contract")
    }

    let sourceInput: any = {
      sources: {},
    }

    if (data.language) {
      sourceInput.language =
        data.language.charAt(0).toUpperCase() + data.language.slice(1)
    }

    if (data.compiler_settings) {
      if (data.compiler_settings.compilationTarget) {
        delete data.compiler_settings.compilationTarget
      }

      if (data.compiler_settings.libraries) {
        delete data.compiler_settings.libraries
      }

      sourceInput.settings = data.compiler_settings
    }

    /**
     * These type of explorer have low reliable source code, its more better to use sourcify
     * that they provided if it exist. Though, this is a lot slower and a lot of work.
     * As inputs can be IPFS, Github, Swarm, etc. we will use the existing explorer endpoint to correctly
     * construct the files (key from sourify) with its code (value from explorer). Sigh...
     *
     * If its single file, then don't bother with the sourcify, hence the additional_sources check.
     * Most likely sourcify will be used for multi-file contracts and that sourify will use url as files instead of content
     */
    if (data.sourcify_repo_url && data.additional_sources) {
      const sourify = await fetch(
        `https://repo.sourcify.dev/contracts/full_match/${this.chainId}/${address}/metadata.json`
      )
      if (!sourify.ok) {
        // Couln't find the metadata provided by sourcify, hence resort to default explorer flow
        sourceInput.sources = this.generateSources(data.additional_sources)
      } else {
        const sourifyData = await sourify.json()

        try {
          const sources: any = await this.metadataGetSources(sourifyData)
          sourceInput.sources = sources
        } catch (error) {
          return generateSourceCodeError("Error loading contract")
        }
      }
    } else {
      sourceInput.sources = this.generateSources(data.additional_sources)
    }

    // People put ridiculous names for their contracts, so we will have to manually set the contract name
    let nameToUse: string = data.file_path
    if (!data.file_path || data.file_path === ".sol") {
      nameToUse = data.name
      if (!nameToUse) {
        nameToUse = "Contract"
      }
    }
    let sourceName: string = this.appendExtension(nameToUse)
    sourceInput.sources[sourceName] = {
      content: data.source_code,
    }

    return {
      status: "1",
      message: "OK",
      result: [
        {
          SourceCode: `{${JSON.stringify(sourceInput)}}`,
          ABI: JSON.stringify(data.abi),
          ContractName: data.name,
          CompilerVersion: data.compiler_version,
          OptimizationUsed: data.optimization_enabled ? "1" : "0",
          Runs: data.optimization_runs || "200",
          ConstructorArguments: data.constructor_args || "",
          EVMVersion: data.evm_version || "default",
          Library: JSON.stringify(data.external_libraries) || "",
          LicenseType: "0",
          Proxy: "",
          Implementation: "",
          SwarmSource: "",
        },
      ],
    }
  }
}
