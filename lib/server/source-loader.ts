import path from "path"
import { GithubResolver } from "@resolver-engine/imports/build/resolvers/githubresolver"

import { ContractDependency, ContractPaths } from "@/lib/core"

import { GITHUBUSERCONTENT_REGEX, resolve } from "./utils"

/**
 * Main function to get the solidity contract source code
 * @param url
 * @returns
 */
export const getSolidityContract = async (
  url: string,
  remappings: Record<string, string>
) => {
  const loader = new SolidityLoader(url)
  return await loader.generateSource({
    remappings,
  })
}

class SolidityLoader {
  source: string
  constructor(source: string) {
    this.source = source
  }

  async generateSource({
    remappings,
  }: {
    remappings?: Record<string, string>
  }): Promise<any | string> {
    if (!this.isValidURL()) return "Invalid Github URL Path"

    const resolver = GithubResolver()
    const raw = (await resolver(this.source, { resolver: "" })) || ""
    if (!raw) return "Can't resolve the Github URL Path"

    // Fetch the source code
    const response = await fetch(raw)
    if (!response.ok) return "Failed to fetch the source code"

    const content = await response.text() // Main source code
    const sourceName = raw.replace(GITHUBUSERCONTENT_REGEX, "")

    let dependencies: ContractDependency[] = []
    try {
      dependencies = await extractImports(content, raw, [], remappings)
      dependencies = removeDuplicatesPreserveOrder(dependencies)
    } catch (error: any) {
      console.log(error)
      return "Error loading dependencies"
    }

    const { sources } = flattenContracts({
      dependencies,
      content,
      includeSource: true,
    })

    return {
      language: "Solidity",
      sources: {
        ...sources,
        [sourceName]: {
          content,
        },
      },
    }
  }

  isValidURL(): boolean {
    if (!this.source) return false
    if (!this.source.startsWith("https://github.com")) return false
    if (!this.source.endsWith(".sol")) return false
    return true
  }
}

async function extractImports(
  content: any,
  mainPath: any = "",
  libraries: string[] = [],
  remappings: Record<string, string> = {}
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

    // Handle remappings if provided
    const maps: string[] = Object.keys(remappings) || []
    const remapper: string =
      maps.find((map) => contractPath.filePath.startsWith(map)) || ""

    const fileToResolve: string = remapper
      ? contractPath.filePath.replace(remapper, remappings[remapper])
      : contractPath.filePath

    // console.log(contractPath.filePath, fileToResolve)
    const { fileContents } = await resolve(fileToResolve)
    let codeContent = fileContents

    // Handle alias imports; ie. import { A as B, C as D } from "Z"
    if (aliasList) {
      const names: string[] = aliasList
        .split(",")
        .map((name: string) => name.trim())
      names.forEach((name: string) => {
        const alias = name.split(" as ")
        if (alias.length === 2) {
          codeContent = codeContent.replace(new RegExp(alias[0], "g"), alias[1])
        }
      })
    }

    matches.push({
      paths: contractPath,
      fileContents: codeContent,
      originalContents: fileContents,
    })
    matches.push(
      ...(await extractImports(
        fileContents,
        contractPath.filePath,
        libraries,
        remappings
      ))
    )
  }

  return matches
}

function removeDuplicatesPreserveOrder(
  files: ContractDependency[]
): ContractDependency[] {
  const seenPaths = new Set<string>()
  const result: ContractDependency[] = []

  for (let i = files.length - 1; i >= 0; i--) {
    const file = files[i]
    // console.log(path.basename(file.paths.originalFilePath));
    if (!seenPaths.has(file.paths.originalFilePath)) {
      result.unshift(file) // Add to the beginning of the array
      seenPaths.add(path.basename(file.paths.originalFilePath))
    }
  }

  return result
}

export async function getEntryDetails(output: any, entry: string) {
  entry = entry.replace(/\.[^/.]+$/, "") // Remove file extension
  return new Promise((resolve, reject) => {
    Object.keys(output.contracts).forEach((contractSource) => {
      if (contractSource === entry) {
        for (var contractName in output.contracts[entry]) {
          resolve({
            data: output.contracts[contractSource][contractName],
            targetCompilation: contractSource,
            target: contractName,
          })
        }
      }
      Object.keys(output.contracts[contractSource]).forEach((contractName) => {
        if (contractName === entry) {
          resolve({
            data: output.contracts[contractSource][entry],
            targetCompilation: contractSource,
            target: contractName,
          })
        }
      })
    })

    // If the entryContractName is not found, you might want to reject the promise
    // reject(new Error("Entry contract not found"))

    // Now we just use the first instance of compiled
    const key = Object.keys(output.contracts).pop() || ""
    resolve({
      data: output.contracts[key][entry],
      targetCompilation: key,
      target: key,
    })
  })
}

/**
 * Removes SPDX license headers and import statements from a Solidity file content.
 *
 * @param {string} fileContents - The content of the Solidity file.
 * @returns {string} - The modified content with SPDX license headers and imports removed.
 *
 * @example
 * const fileContents = "pragma solidity ^0.8.0;\n// SPDX-License-Identifier: MIT\nimport 'SomeContract.sol';\n\ncontract MyContract { ... }";
 * const modifiedContents = removeHeadersAndImports(fileContents);
 * console.log(modifiedContents);
 * // Output: "pragma solidity ^0.8.0;\n\ncontract MyContract { ... }"
 */
export const removeContractHeaders = (content: string): string =>
  (content || "").replace(/\/\/ SPDX-License-Identifier:.*|import [^;]+;/g, "")

export const flattenContracts = ({
  dependencies,
  content = "",
  includeSource = false,
}: {
  dependencies: ContractDependency[]
  content?: string
  includeSource?: boolean
}) => {
  let flattenContract: string = ""
  const sources: Record<string, { content: string }> = {}
  dependencies.reverse().forEach((dependency) => {
    const { paths, originalContents, fileContents } = dependency

    if (includeSource) {
      const sourceKey = paths.isHttp() ? paths.folderPath : paths.filePath
      sources[sourceKey] = { content: originalContents || "" }
    }

    flattenContract += removeContractHeaders(fileContents)
  })

  if (content) {
    flattenContract += removeContractHeaders(content)
  }

  return { flattenContract, sources }
}
