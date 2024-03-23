import { ContractPaths } from "./helpers/paths"

export interface ContractDependency {
  fileContents: string
  originalContents?: string
  paths: ContractPaths
}

export interface CompileResponse {
  abi: any[]
  evm: any
}

export interface CompileResult {
  data: CompileResponse
  flattenContract?: string
}

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
    [key: string]: CompileSource
  }
}

export interface CompileSource {
  content: string
}

export interface SolcError {
  component: string
  errorCode: string
  formattedMessage: string
  message: string
  severity: string
  sourceLocation: any[] // You might want to provide a more specific type for sourceLocation
  type: string
}

export interface CompileError {
  details: SolcError[]
}
