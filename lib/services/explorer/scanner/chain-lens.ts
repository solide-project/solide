import { BaseScan } from "@/lib/services/explorer/scanner/base"
import {
    generateSourceCodeError, ContractInfo, EthGetSourceCodeInterface, ExplorerInterface
} from "@/lib/services/explorer/scanner/explorer-service"
import { solcVersion } from "@/lib/utils";
import { compilerVersions } from "@/lib/versions";


interface FileMetadata {
    name: string;
    /**
     * path are typically formatted as /home/app/repository/contracts/full_match/${chainId}/${address}/metadata.json",
     */
    path: string;
    content: string;
}

interface FileResponse {
    status: string;
    files: FileMetadata[];
}

interface FileError {
    error: string;
    message: string;
}

export class ChainLensClient extends BaseScan implements ExplorerInterface {
    constructor(chainId: string) {
        super(chainId)
    }

    getSourceCodeEndpoint(address: string): string {
        return `${address}`
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

        if (data.error || data.message) {
            return generateSourceCodeError(data.message)
        }

        data = data as FileResponse;
        let results: any = this.generateDefaultResult()
        let sourceInput: any = {
            sources: {},
        }

        data.files
            .filter((file: FileMetadata) => file.name.endsWith(".sol"))
            .forEach((file: FileMetadata) => {
                const contractAddress = file.path.indexOf('0x');
                const parts = file.path.substring(contractAddress);

                const paths = parts.split('/').slice(2);
                const contractPath = paths.join('/');
                // console.log(contractPath)
                sourceInput.sources[contractPath || file.path] = {
                    content: file.content,
                }
            })

        results.SourceCode = `{${JSON.stringify(sourceInput)}}`

        const metadata: FileMetadata = data.files.filter((file: FileMetadata) => file.name === "metadata.json")[0]

        if (metadata) {
            const sourifyData = JSON.parse(metadata.content)
            if (sourifyData.language) {
                results.Language = sourifyData.language
            }

            if (!results.ContractName) {
                const entry = Object.entries(sourifyData.settings.compilationTarget)[0];
                if (entry) {
                    results.ContractName = entry[0]
                }
            }

            results.ContractName = this.appendExtension(results.ContractName)

            if (sourifyData.settings.libraries) {
                delete sourifyData.settings.libraries
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

            results.ABI = JSON.stringify(sourifyData.output?.abi || {})
        }

        return {
            status: "1",
            message: "OK",
            result: [results],
        }
    }
}
