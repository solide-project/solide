import { getAPI, getAPIKey } from "@/lib/chains"

import { ExplorerInterface } from "../explorer-interface"
import {
  generateSourceCodeError,
  getSourceCodeEndpoint,
} from "../get-source-code"
import { EthGetSourceCodeInterface } from "../get-source-code-interface"
import { BaseScan } from "./base"

export class EtherScanClient extends BaseScan implements ExplorerInterface {
  constructor(chainId: string) {
    super(chainId)
  }
}
