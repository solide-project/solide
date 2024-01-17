import path from "path"

import { getDirPath } from "../solide/utils"

/**
 * isRelative is true means that dependency path is relative to source (not in node_modules)
 * Note the isRelative will break (not work) if the dependency is in node_modules is using relative paths in import
 * Also note implementation will ruin the https:// as normalising // will result in /
 * @param dependency
 * @param filePath
 * @returns
 */
function getNormalizedDependencyPath(dependency: string, filePath: string) {
  // We assume that if the dependency starts with ./ or ../ it is a relative path
  if (dependency.startsWith("./") || dependency.startsWith("../")) {
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      // remove the http:// or https://
      const rawPath = filePath.substring(filePath.indexOf("//") + 2)
      dependency = path.join(getDirPath(rawPath), dependency)
      dependency = path.normalize(dependency)

      // Add back the http:// or https://
      dependency =
        filePath.substring(0, filePath.indexOf("//") + 2) + dependency
      return { filePath: dependency.replace(/\\/g, "/"), isRelative: true }
    }

    dependency = path.join(getDirPath(filePath), dependency)
    dependency = path.normalize(dependency)
    return { filePath: dependency.replace(/\\/g, "/"), isRelative: false }
  }

  return { filePath: dependency, isRelative: false }
}
