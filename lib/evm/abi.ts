export interface ABIParameter {
  internalType: string
  name: string
  type: string
}

export interface ABIEntry {
  inputs: ABIParameter[]
  name: string
  type: string
  constant: boolean
  stateMutability: "pure" | "view" | "nonpayable" | "payable"
  payable: boolean
  outputs?: ABIParameter[]
}

/**
 * Null ensure that it was not a valid ABI
 * @param value
 */
export const parse = (value: any): ABIEntry[] => {
  const parsedABI: ABIEntry[] = JSON.parse(value)

  if (!Array.isArray(parsedABI)) {
    throw new Error("Invalid ABI")
  }

  return parsedABI
}

/**
 * Parse and input value to its input type
 * @param inputs
 * @param value
 * @returns
 */
export const abiParameterToNative = (
  input: ABIParameter,
  value: any = ""
): any => {
  let data: any = value.toString()
  if (input.type.includes("int") && !input.type.includes("[]")) {
    data = parseInt(value)
  } else if (input.type.includes("bool")  && !input.type.includes("[]")) {
    data = value === "true"
  } else if (input.type.includes("tuple")  && !input.type.includes("[]")) {
    data = JSON.parse(value)
  } else if (input.type.includes("[]")) {
    data = JSON.parse(value)
  }

  return data
}
