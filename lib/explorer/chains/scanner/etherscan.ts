import { ExplorerInterface } from "../explorer-interface"
import { BaseScan } from "./base"

export class EtherScanClient extends BaseScan implements ExplorerInterface {
  constructor(chainId: string) {
    super(chainId)
  }
}
