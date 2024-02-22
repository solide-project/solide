import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { ChainID, getExplorer, getNetworkNameFromChainID } from "@/lib/chains"
import { BlockScoutOldClient } from "@/lib/services/explorer/scanner/blockscout-old"
import { EthGetSourceCodeInterface } from "@/lib/services/explorer/scanner/explorer-service"

import {
  API_STATUS,
  EOA_ADDRESS,
  NOT_VERIFIED_MESSAGE,
  PROXY_CONTRACT_NAME,
  ZERO_INVALID_ADDRESS,
  waitHalfSecond,
} from "../util/constants"

const testTitle: string = "Block Scout API"
describe(`${testTitle} Basic`, () => {
  it("should not be null", () => {
    const client = new BlockScoutOldClient(ChainID.FUSE_MAINNET)

    expect(client).not.toBeNull()
  })
  it("should not be null", () => {
    const client = new BlockScoutOldClient(ChainID.METIS_SEPOLIA)
    const expectedChainId = client.chainId

    const actualChainId = ChainID.METIS_SEPOLIA

    expect(actualChainId).toEqual(expectedChainId)
  })
  it("should not be null", () => {
    const client = new BlockScoutOldClient(ChainID.FUSE_MAINNET)
    const expectedChainId = client.chainId

    const actualChainId = ChainID.FUSE_MAINNET

    expect(actualChainId).toEqual(expectedChainId)
  })
})

describe(`${testTitle} Explorer 1 (${getNetworkNameFromChainID(
  ChainID.METIS_ANDROMEDA
)})`, () => {
  //#region Setup
  let params: {
    chainId: string
    testContract: string
    proxyContract: string
  }
  beforeEach(() => {
    params = {
      chainId: ChainID.METIS_ANDROMEDA,
      testContract: "0x2136d8017ac5f4Db99A7F9E23f15116b9c98Be4E",
      proxyContract: "0x58ad3a43cD7a0B1adb70814f3602F049c48AC3F8",
    }
  })
  afterEach(async () => {
    // Since we are will be using API calls, and are limited to 5 calls per second.
    // Hence, for each test, we'll wait a bit
    // Not ideal, but in order for us test our frontend to pass, in case it exceeds the limit
    await waitHalfSecond()
  })
  //#endregion

  //#region Tests
  it("should contain the correct url endpoints params", async () => {
    const client = new BlockScoutOldClient(params.chainId)
    const expectedURL = getExplorer(params.chainId)
    const expectedContract = params.testContract

    // https://andromeda-explorer.metis.io/api?module=contract&action=getsourcecode&address=0x2136d8017ac5f4Db99A7F9E23f15116b9c98Be4E
    const actualEndpoint = await client.getsourcecodeURL(expectedContract)

    expect(actualEndpoint.startsWith(expectedURL)).toBeTruthy()
    expect(actualEndpoint.endsWith(expectedContract)).toBeTruthy()
  })
  it("should return the correct api endpoint for given address", async () => {
    const client = new BlockScoutOldClient(params.chainId)
    const expectedURL = getExplorer(params.chainId)
    const expectedContract = params.testContract

    const actualEndpoint = await client.getsourcecodeURL(expectedContract)

    expect(actualEndpoint.startsWith(expectedURL)).toBeTruthy()
    expect(actualEndpoint.endsWith(expectedContract)).toBeTruthy()
  })
  it("should return the correct response for verified smart contract", async () => {
    const client = new BlockScoutOldClient(params.chainId)
    const expectedContract = params.testContract
    const expectedStatus = API_STATUS.SUCCESS

    const actualData: EthGetSourceCodeInterface = await client.getSourceCode(
      expectedContract
    )
    const actualResult: any = actualData.result[0]
    const actualABI = JSON.parse(actualResult.ABI)

    expect(actualData.status).toEqual(expectedStatus)
    expect(Array.isArray(actualABI)).toBeTruthy()
    expect(actualResult.CompilerVersion).not.toBeNull()
  })
  it("should return the error response for unverified smart contract", async () => {
    const client = new BlockScoutOldClient(params.chainId)
    const expectedContract = EOA_ADDRESS
    const expectedStatus = API_STATUS.FAIL

    const actualData: EthGetSourceCodeInterface = await client.getSourceCode(
      expectedContract
    )

    expect(actualData.status).toEqual(expectedStatus)
    expect(actualData.result).contain(NOT_VERIFIED_MESSAGE)
  })
  it("should return the error response with error status for invalid address", async () => {
    const client = new BlockScoutOldClient(params.chainId)
    const expectedContract = ZERO_INVALID_ADDRESS
    const expectedStatus = API_STATUS.FAIL

    const actualData: EthGetSourceCodeInterface = await client.getSourceCode(
      expectedContract
    )

    expect(actualData.status).toEqual(expectedStatus)
    expect(actualData.result).toBeNull()
    expect(actualData.message).contain("Invalid")
  })
  it("should return the the implementation contract for proxy contracts", async () => {
    const client = new BlockScoutOldClient(params.chainId)
    const expectedContract = params.proxyContract
    const expectedStatus = API_STATUS.SUCCESS

    const actualData: EthGetSourceCodeInterface = await client.getSourceCode(
      expectedContract
    )
    const actualResult: any = actualData.result[0]

    expect(actualData.status).toEqual(expectedStatus)
    expect(actualResult.ContractName.toLowerCase()).not.contain(
      PROXY_CONTRACT_NAME
    )
  })
  //#endregion
})

describe(`${testTitle} Explorer 2 (${getNetworkNameFromChainID(
  ChainID.MANTLE_MAINNET
)})`, () => {
  //#region Setup
  let params: {
    chainId: string
    testContract: string
    proxyContract: string
  }
  beforeEach(() => {
    params = {
      chainId: ChainID.MANTLE_MAINNET,
      testContract: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
      proxyContract: "0x67a836d2c1E816aD8e2D6E136860F0DBac217586",
    }
  })
  afterEach(async () => {
    // Since we are will be using API calls, and are limited to 5 calls per second.
    // Hence, for each test, we'll wait a bit
    // Not ideal, but in order for us test our frontend to pass, in case it exceeds the limit
    await waitHalfSecond()
  })
  //#endregion

  //#region Tests
  it("should contain the correct url endpoints params", async () => {
    const client = new BlockScoutOldClient(params.chainId)
    const expectedURL = getExplorer(params.chainId)
    const expectedContract = params.testContract

    // https://explorer.mantle.xyz/api?module=contract&action=getsourcecode&address=0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8
    const actualEndpoint = await client.getsourcecodeURL(expectedContract)

    expect(actualEndpoint.startsWith(expectedURL)).toBeTruthy()
    expect(actualEndpoint.endsWith(expectedContract)).toBeTruthy()
  })
  it("should return the correct api endpoint for given address", async () => {
    const client = new BlockScoutOldClient(params.chainId)
    const expectedURL = getExplorer(params.chainId)
    const expectedContract = params.testContract

    const actualEndpoint = await client.getsourcecodeURL(expectedContract)

    expect(actualEndpoint.startsWith(expectedURL)).toBeTruthy()
    expect(actualEndpoint.endsWith(expectedContract)).toBeTruthy()
  })
  it("should return the correct response for verified smart contract", async () => {
    const client = new BlockScoutOldClient(params.chainId)
    const expectedContract = params.testContract
    const expectedStatus = API_STATUS.SUCCESS

    const actualData: EthGetSourceCodeInterface = await client.getSourceCode(
      expectedContract
    )
    const actualResult: any = actualData.result[0]
    const actualABI = JSON.parse(actualResult.ABI)

    expect(actualData.status).toEqual(expectedStatus)
    expect(Array.isArray(actualABI)).toBeTruthy()
    expect(actualResult.CompilerVersion).not.toBeNull()
  })
  it("should return the error response for unverified smart contract", async () => {
    const client = new BlockScoutOldClient(params.chainId)
    const expectedContract = EOA_ADDRESS
    const expectedStatus = API_STATUS.FAIL

    const actualData: EthGetSourceCodeInterface = await client.getSourceCode(
      expectedContract
    )

    expect(actualData.status).toEqual(expectedStatus)
    expect(actualData.result).contain(NOT_VERIFIED_MESSAGE)
  })
  it("should return the error response with error status for invalid address", async () => {
    const client = new BlockScoutOldClient(params.chainId)
    const expectedContract = ZERO_INVALID_ADDRESS
    const expectedStatus = API_STATUS.FAIL

    const actualData: EthGetSourceCodeInterface = await client.getSourceCode(
      expectedContract
    )

    expect(actualData.status).toEqual(expectedStatus)
    expect(actualData.result).toBeNull()
    expect(actualData.message).contain("Invalid")
  })
  it("should return the the implementation contract for proxy contracts", async () => {
    const client = new BlockScoutOldClient(params.chainId)
    const expectedContract = params.proxyContract
    const expectedStatus = API_STATUS.SUCCESS

    const actualData: EthGetSourceCodeInterface = await client.getSourceCode(
      expectedContract
    )
    const actualResult: any = actualData.result[0]

    expect(actualData.status).toEqual(expectedStatus)
    expect(actualResult.ContractName.toLowerCase()).not.contain(
      PROXY_CONTRACT_NAME
    )
  })
  //#endregion
})
