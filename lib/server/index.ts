/**
 * Dependencies
 * - @resolver-engine/imports
 */
export { getSolcByVersion } from "./solc"
export type { Solc } from "./solc"
export {
  getSolidityContract,
  flattenContracts,
  removeContractHeaders,
} from "./source-loader"
