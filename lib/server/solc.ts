var solc = require("solc")

export interface Solc {
  version(): any
  compile(input: string): any
}

/**
 * This will persist for a session
 */
const solcCache: Record<string, Solc> = {}

/**
 * Load solc by version, this will cache the solc instance for the session
 * If throws an error, it will return the default solc instance
 * @param solcVersion
 * @returns
 */
export const getSolcByVersion = async (solcVersion: string): Promise<Solc> => {
  if (solcCache[solcVersion]) {
    return solcCache[solcVersion]
  }

  return new Promise((resolve, reject) => {
    solc.loadRemoteVersion(solcVersion, (err: any, solcInstance: Solc) => {
      if (err) {
        console.error(err)
        resolve(solc)
      } else {
        solcCache[solcVersion] = solcInstance
        resolve(solcInstance)
      }
    })
  })
}
