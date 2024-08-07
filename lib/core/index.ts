/**
 * Dependencies
 * - jszip
 */
export { isVFSFile } from "./utils/interface"
export type { VFSFile, Sources, VFSNode } from "./utils/interface"

export { zipSources, downloadBlob, downloadJSON } from "./deps/downloader"
export * from "./utils/query"
export * from "./utils/paths"
export * from "./utils/contract-dependency"
export * from "./file-system/interfaces"
