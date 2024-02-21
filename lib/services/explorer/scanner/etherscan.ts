import { BaseScan } from "@/lib/services/explorer/scanner/base"
import {
  generateSourceCodeError, ContractInfo, EthGetSourceCodeInterface, ExplorerInterface
} from "@/lib/services/explorer/scanner/explorer-service"

export class EtherScanClient extends BaseScan implements ExplorerInterface {
  constructor(chainId: string) {
    super(chainId)
  }
}
