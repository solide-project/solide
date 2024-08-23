import { Abi, AbiParameter } from "viem"

import { isAddress } from "../evm/ethers"

/**
 * Null ensure that it was not a valid ABI
 * @param value
 */
export const parse = (value: any): Abi => {
  const parsedABI: Abi = JSON.parse(value)

  if (!Array.isArray(parsedABI)) {
    throw new Error("Invalid ABI")
  }

  return parsedABI
}

/**
 * Convert to native type for calling contract
 * @param value
 * @param input
 * @returns
 */
export const toNative = (value: any = "", input: AbiParameter) => {
  let data: any = value.toString()

  // int, uint
  if (input.type.match(/^(u?int)([0-9]*)$/) && !input.type.includes("[]")) {
    data = parseInt(value, 10)
  }
  // boolean
  else if (input.type === "bool") {
    data = value === "true" || value === true
  }
  // address
  else if (input.type === "address") {
    if (typeof value !== "string" || !isAddress(value)) {
      throw new Error("Invalid Ethereum address format")
    }
    data = value
  }
  // bytes
  else if (input.type.match(/^bytes([0-9]+)?$/) && !input.type.includes("[]")) {
    if (typeof value !== "string" || !/^0x[a-fA-F0-9]*$/.test(value)) {
      throw new Error("Invalid bytes format")
    }
    data = value
  }
  // fixed, ufixed
  else if (
    input.type.match(/^(u?fixed)([0-9]*)x([0-9]*)$/) &&
    !input.type.includes("[]")
  ) {
    data = parseFloat(value)
  }
  // tuples
  else if (input.type === "tuple" || input.type === "tuple[]") {
    data = typeof value === "string" ? JSON.parse(value) : value
  }
  // arrays
  else if (input.type.endsWith("[]")) {
    data = Array.isArray(value) ? value : JSON.parse(value)
    // data = data.map((item: any) => abiParameterToNative({ ...input, type: input.type.replace("[]", "") }, item));
  }
  // complex types
  else if (input.type.match(/^(u?int|bool|address|bytes|tuple)\[([0-9]*)\]$/)) {
    data = Array.isArray(value) ? value : JSON.parse(value)
    // data = data.map((item: any) => abiParameterToNative({ ...input, type: input.type.replace(/\[[0-9]*\]$/, "") }, item));
  }

  return data
}
