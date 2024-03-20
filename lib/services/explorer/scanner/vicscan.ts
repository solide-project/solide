import { solcVersion } from "@/lib/versions"
import { BaseScan } from "@/lib/services/explorer/scanner/base"
import {
    generateSourceCodeError, ContractInfo, EthGetSourceCodeInterface, ExplorerInterface
} from "@/lib/services/explorer/scanner/explorer-service"


export class VicScanClient extends BaseScan implements ExplorerInterface {
    private headers: Headers

    constructor(chainId: string) {
        super(chainId)

        this.headers = new Headers()
        this.headers.append("Content-Type", "application/json")
    }

    getSourceCodeEndpoint(address: string): string {
        return `api/account/${address}`
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
        if (data.status === 400 || data.error) {
            return generateSourceCodeError(data.error.message || "Error loading contract")
        }

        if (!data.contractData) {
            return generateSourceCodeError("Contract not found")
        }

        let results: any = this.generateDefaultResult()
        let sourceInput: any = {
            sources: data.contractData.sourceCode,
        };
        results.SourceCode = `{${JSON.stringify(sourceInput)}}`

        results.ABI = data.contractData.abiCode || ""
        results.OptimizationUsed = "0" // data.contractData.optimization ? "1" : "0"
        results.Runs = "0"
        results.LicenseType = "0"
        results.CompilerVersion = data.contractData.compiler || solcVersion // Fall back to default if not found
        results.ContractName = this.appendExtension(data.contractData.contractName)

        return {
            status: "1",
            message: "OK",
            result: [results],
        }
    }
}
