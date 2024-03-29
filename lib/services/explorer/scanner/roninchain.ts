import path from "path"
import { ContractDependency } from "@/lib/interfaces"
import { ContractPaths } from "@/lib/solide/contract-paths"
import { compilerVersions } from "@/lib/versions"
import { solcVersion } from "@/lib/utils"
import { BaseScan } from "@/lib/services/explorer/scanner/base"
import {
  generateSourceCodeError, ContractInfo, EthGetSourceCodeInterface, ExplorerInterface
} from "@/lib/services/explorer/scanner/explorer-service"

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
    ;(data.result || []).forEach((element: any) => {
      sourceInput.sources[element.name] = {
        content: element.content,
      }
    })

    const metadata = await fetch(
      `https://explorer-kintsugi.roninchain.com/v2/${this.chainId}/contract/${address}/metadata`
    )
    if (metadata.ok) {
      const metadataData = await metadata.json()
      if (data.message !== "ok" || !data.result) {
        return generateSourceCodeError("Error loading metadata")
      }

      if (metadataData.result.settings) {
        if (metadataData.result.settings.compilationTarget) {
          // Since API doesn't provide the contract name we can just get it from the compilationTarget
          results.ContractName =
            Object.keys(metadataData.result.settings.compilationTarget).pop() ||
            ""
          // Here we want to turn the contract source into a .sol path
          if (!results.ContractName.endsWith(".sol")) {
            results.ContractName = results.ContractName.concat(".sol")
          }

          const absoluteContract = `${
            metadataData.result.settings.compilationTarget[results.ContractName]
          }.sol`

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

          results.ContractName = this.appendExtension(absoluteContract)

          delete metadataData.result.settings.compilationTarget
        }

        if (metadataData.result.settings.libraries) {
          delete metadataData.result.settings.libraries
        }

        if (metadataData.result.settings.remappings) {
          delete metadataData.result.settings.remappings
        }

        sourceInput.settings = metadataData.result.settings
      }

      if (metadataData.result.language) {
        results.Language = metadataData.result.language
      }

      if (metadataData.result.compiler?.version) {
        // Found a valid version as per sourcify can just be a version number
        const compilerVersion = compilerVersions.find((element: string) =>
          element.includes(metadataData.result.compiler.version)
        )
        results.CompilerVersion = compilerVersion || solcVersion // Fall back to default if not found
      }
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
      console.log(dependencies.length)
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
    console.log(filePath, parsedPath)
    const fileContents = this.files[parsedPath]?.content || ""
    return { fileContents } as any
  }
}
