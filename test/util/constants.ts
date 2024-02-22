export enum API_STATUS {
  SUCCESS = "1",
  FAIL = "0",
}

export const EOA_ADDRESS = "0x30D8D1D6bD552786B3fD1Cb44Bb357e58C68ca20"
export const ZERO_INVALID_ADDRESS = "0x0"

export const PROXY_CONTRACT_NAME = "proxy"
export const NOT_VERIFIED_MESSAGE = "not verified"

export function waitHalfSecond(): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
}
