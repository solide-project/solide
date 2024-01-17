import { Solc } from "./interface"

var solc = require("solc")

export const getSolcByVersion = async (solcVersion: string): Promise<Solc> => {
  return new Promise((resolve, reject) => {
    solc.loadRemoteVersion(
      solcVersion,
      (err: any, solcInstance: Solc | Promise<any>) => {
        if (err) {
          console.error(err)
          resolve(solc)
        } else {
          resolve(solcInstance)
        }
      }
    )
  })
}
