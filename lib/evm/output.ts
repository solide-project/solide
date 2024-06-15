export interface DecompileOutput {
  contracts: {
    [key: string]: {
      [key: string]: DecompileSource
    }
  }
  errors: any[]
  sources: any
}

export interface DecompileSource {
  abi: any[]
  devdoc: {
    details: string
    kind: string
    methods: Record<string, any>
    version: number
  }
  evm: {
    bytecode: {
      functionDebugData: Record<string, any>
      generatedSources: any[]
      linkReferences: Record<string, any>
      object: string
      opcodes: string
      sourceMap: string
    }
    deployedBytecode: {
      functionDebugData: Record<string, any>
      generatedSources: any[]
      immutableReferences: Record<string, any>
      linkReferences: Record<string, any>
      object: string
      opcodes: string
      sourceMap: string
    }
  }
  metadata: string
  settings: {
    compilationTarget: Record<string, string>
    evmVersion: string
    libraries: Record<string, any>
    metadata: {
      bytecodeHash: string
    }
    optimizer: {
      enabled: boolean
      runs: number
    }
    remappings: any[]
  }
  sources: Record<
    string,
    {
      keccak256: string
      license: string
      urls: string[]
    }
  >
  version: number
  userdoc: {
    kind: string
    methods: Record<string, any>
    version: number
  }
}
