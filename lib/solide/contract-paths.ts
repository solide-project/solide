import path from "path"

import { getNormalizedDependencyPath } from "./utils"

export class ContractPaths {
  filePath: string
  originalFilePath: string
  isRelative: boolean
  folderPath: string
  parentPath: string
  parentBasePath: string

  constructor(originalPath: string, fromPath: string) {
    this.originalFilePath = originalPath
    this.parentPath = fromPath
    const { filePath, isRelative } = getNormalizedDependencyPath(
      originalPath,
      fromPath
    )
    this.filePath = filePath
    this.isRelative = isRelative
    this.folderPath = ""
    this.parentBasePath = ""
    if (this.isHttp()) {
      this.folderPath = filePath.replace(
        /https:\/\/raw.githubusercontent.com\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\//,
        ""
      )
      // console.log(this.folderPath, filePath)
      this.parentBasePath =
        this.getCommonDirectory(this.filePath, fromPath) || ""
      return
    }
  }

  isHttp() {
    return this.filePath.startsWith("http")
  }

  getCommonDirectory(url1: string, url2: string) {
    const path1 = new URL(url1).pathname
    const path2 = new URL(url2).pathname

    const pathParts1 = path1.split("/").filter(Boolean)
    const pathParts2 = path2.split("/").filter(Boolean)

    const commonDirectory = []
    for (let i = 0; i < Math.min(pathParts1.length, pathParts2.length); i++) {
      if (pathParts1[i] === pathParts2[i]) {
        commonDirectory.push(pathParts1[i])
      } else {
        break
      }
    }

    return path.join(...commonDirectory).replace(/\\/g, "/")
  }
}
