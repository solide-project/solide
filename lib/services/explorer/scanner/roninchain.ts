import path from "path"
import { ContractDependency } from "@/lib/interfaces"
import { ContractPaths } from "@/lib/solide/contract-paths"
import { compilerVersions } from "@/lib/versions"
import { solcVersion } from "@/lib/utils"
import { BaseScan } from "@/lib/services/explorer/scanner/base"
import {
  generateSourceCodeError, ContractInfo, EthGetSourceCodeInterface, ExplorerInterface
} from "@/lib/services/explorer/scanner/explorer-service"
import { SolidityMetadata } from "../../solidity-metadata"

export class RoninChainClient extends BaseScan implements ExplorerInterface {
  constructor(chainId: string) {
    super(chainId)
  }

  getSourceCodeEndpoint(address: string): string {
    return `v2/${this.chainId}/contract/${address}/src`
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
    if (data.message !== "ok" || !data.result) {
      return generateSourceCodeError(data.message || "Error loading contract")
    }

    let results: any = this.generateDefaultResult()
    let sourceInput: any = {
      sources: {},
    }

      // Note the current Ronin API doesn't provide the contract path, hence compilation won't work that well.
      // We need to use the metadata API to get the contract name and resolve the contract paths
      ; (data.result || []).forEach((element: any) => {
        sourceInput.sources[element.name] = {
          content: element.content,
        }
      })

    const metadataResponse = await fetch(
      `https://explorer-kintsugi.roninchain.com/v2/${this.chainId}/contract/${address}/metadata`
    )
    if (metadataResponse.ok) {
      const metadata = await metadataResponse.json()
      if (data.message !== "ok" || !data.result) {
        return generateSourceCodeError("Error loading metadata")
      }

      if (metadata.result.settings) {
        if (metadata.result.settings.compilationTarget) {
          results.ContractName = this.appendExtension(
            SolidityMetadata.contractName(metadata.result))

          // This has been refactored
          const absoluteContract = results.ContractName

          const resolver = new RoninFileResolver(sourceInput.sources)
          const resolvedSources = await resolver.getSources(
            sourceInput.sources[absoluteContract].content,
            results.ContractName
          )

          const baseContent = sourceInput.sources[absoluteContract].content
          sourceInput.sources = resolvedSources
          sourceInput.sources[results.ContractName] = {
            content: baseContent,
          }

        }

        sourceInput.settings = SolidityMetadata.settings(metadata.result)
      }

      results.Language = SolidityMetadata.language(metadata.result)
      results.CompilerVersion = this.formatVersion(
        SolidityMetadata.compilerVersion(metadata)
      )
    }

    results.SourceCode = `{${JSON.stringify(sourceInput)}}`
    // console.log(results);

    return {
      status: "1",
      message: "OK",
      result: [results],
    }
  }
}

class RoninFileResolver {
  files: any
  constructor(files: any) {
    this.files = files
  }

  async getSources(base: string = "", path: string = "") {
    let sources: any = {}
    let dependencies: ContractDependency[] = []
    try {
      dependencies = await this.extractImports(base, path, [])
      dependencies.forEach((dependency) => {
        const { paths, originalContents } = dependency
        sources[paths.filePath] = { content: originalContents }
      })
      return sources
    } catch (error: any) {
      console.log(error)
      return {}
    }
  }

  async extractImports(
    content: any,
    mainPath: any = "",
    libraries: string[] = []
  ): Promise<ContractDependency[]> {
    // Regex to extract import information
    const regex =
      /import\s+{([^}]+)}\s+from\s+[""'']([^""'']+)[""'']|import\s+[""'']([^""'']+)[""''];/g
    const matches: ContractDependency[] = []

    let match
    while ((match = regex.exec(content)) !== null) {
      const [, aliasList, filePathWithAlias, filePathWithoutAlias] = match
      const contractPath = new ContractPaths(
        filePathWithAlias || filePathWithoutAlias,
        mainPath
      )

      // This is to prevent circular dependency and infinite recursion
      if (libraries.includes(contractPath.filePath)) {
        continue
      }
      libraries.push(contractPath.filePath.toString())

      // Get the source code either from node_modules or relative github path
      const { fileContents } = await this.resolve(contractPath.filePath)

      matches.push({
        paths: contractPath,
        fileContents: fileContents,
        originalContents: fileContents,
      })
      matches.push(
        ...(await this.extractImports(
          fileContents,
          contractPath.filePath,
          libraries
        ))
      )
    }

    return matches
  }

  async resolve(filePath: string): Promise<{ fileContents: string }> {
    const parsedPath = path.basename(filePath)
    const fileContents = this.files[parsedPath]?.content || ""
    return { fileContents } as any
  }
}
