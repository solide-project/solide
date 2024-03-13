import { Metadata } from "../models/metadata"

export class SolidityMetadata {
    static language(metadata: Metadata): string {
        return metadata?.language || "Solidity"
    }

    static abi(metadata: Metadata): string {
        return JSON.stringify(metadata?.output?.abi || {})
    }

    static contractName(metadata: Metadata): string {
        if (metadata?.settings?.compilationTarget) {
            const key = Object.keys(metadata.settings.compilationTarget).pop() || ""
            if (key) {
                return metadata.settings.compilationTarget[key]
            }
        }

        return ""
    }

    static compilerVersion(metadata: Metadata): string {
        if (metadata?.compiler?.version) {
            return metadata.compiler.version
        }

        return ""
    }

    static settings(metadata: Metadata): any {
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

    static clean(metadata: Metadata): any {
        metadata.settings = SolidityMetadata.settings(metadata)
        return metadata
    }
}