import path from "path"

export interface CompileInput {
  language: "Solidity" | "Yul" | "LLL" | "Assembly" | "Vyper" | "Aspect"
  settings?: {
    outputSelection: any
    optimizer: any
    evmVersion: string
    metadata: any
    libraries: any
    remappings: any
    metadataHash: string
  }
  sources: {
    [key: string]: SolcSource
  }
}

export interface SolcSource {
  content: string
}

/**
 * convert string to CompilerInput
 * @param content
 * @returns
 */
export const parseInput = (content: string) => {
  try {
    const input = JSON.parse(content)
    return input
  } catch (error) { }

  try {
    const input = JSON.parse(content.slice(1, -1))
    return input
  } catch (error) {
    return undefined
  }
}

export const filterSources = (inputSources: { [fileName: string]: SolcSource }) => {
  const sources: { [fileName: string]: SolcSource } = {}
  Object.entries(inputSources).forEach(([key, value]) => {
    const { ext } = path.parse(key)
    if (ext === ".sol") sources[key] = value
  })
  return sources
}

export interface PartialSolcInput {
  language: "Solidity" | "Yul" | "LLL" | "Assembly" | "Vyper"

  settings: {
    outputSelection: any;
    optimizer: any
    evmVersion: string
    remappings: string[];
    [key: string]: any;
  };

  [key: string]: any;
}

export interface SolcInput extends PartialSolcInput {
  sources: {
    [fileName: string]: SolcSource;
  };
}

export interface SolcSource {
  content: string;
}