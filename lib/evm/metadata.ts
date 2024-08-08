export interface Metadata {
  language?: string
  sources?: any
  compiler?: {
    version?: string
  }
  output?: any
  settings?: {
    optimizer?: {
      enabled?: boolean
      runs?: number
    }
    compilationTarget?: {
      [key: string]: string
    }
    libraries?: {
      [key: string]: string
    }
    remappings?: string[]
    metadata?: {
      appendCBOR?: boolean
      useLiteralContent?: boolean
      bytecodeHash?: "ipfs" | "none" | "bzzr1"
    }
  }
}

export const language = (metadata: Metadata): string => {
  return metadata?.language || "Solidity"
}

export const abi = (metadata: Metadata): string => {
  return JSON.stringify(metadata?.output?.abi || {})
}

export const contractName = (metadata: Metadata): string => {
  if (metadata?.settings?.compilationTarget) {
    const key = Object.keys(metadata.settings.compilationTarget).pop() || ""
    if (key) {
      return metadata.settings.compilationTarget[key]
    }
  }

  return ""
}

export const compilerVersion = (metadata: Metadata): string => {
  if (metadata?.compiler?.version) {
    return metadata.compiler.version
  }

  return ""
}

export const settings = (metadata: Metadata): any => {
  if (!metadata?.settings) {
    return {}
  }

  if (metadata?.settings?.libraries) {
    delete metadata.settings.libraries
  }

  if (metadata?.settings?.compilationTarget) {
    delete metadata.settings.compilationTarget
  }

  if (metadata?.settings?.remappings) {
    delete metadata.settings.remappings
  }

  if (metadata?.settings?.metadata) {
    delete metadata.settings.metadata
  }
  return metadata.settings
}

export const clean = (metadata: Metadata): any => {
  metadata.settings = settings(metadata)
  return metadata
}
