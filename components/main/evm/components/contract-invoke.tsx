"use client"

import { useEffect, useState } from "react"
import { ethers } from "ethers"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sEthers } from "@/lib/services/ethers"
import { sWeb3 } from "@/lib/services/web3"
import { Environment } from "./selected-environment"

interface ContractInvokeProps extends React.HTMLAttributes<HTMLDivElement> {
  setConstructorArgs: Function
  environment?: Environment,
  contractAddress: string
  abi: any[]
  msgValue: string
}

export function ContractInvoke({
  setConstructorArgs,
  environment = Environment.METAMASK,
  contractAddress,
  abi,
  msgValue = "",
}: ContractInvokeProps) {
  const [contract, setContract] = useState<any>(undefined)
  const [isContractLoaded, setIsContractLoaded] = useState<boolean>(false)
  const [ret, setRet] = useState<{
    [key: string]: any
  }>({})

  useEffect(() => {
    // This is a workaround to handle the case where the parameters are not named for the method
    abi = abi.map((method: sEthers.types.ABIEntry) => {
      if (method.type === "function" && method.inputs) {
        method.inputs.forEach((input: sEthers.types.ABIParameter, index: number) => {
          input.name = input.name === "" ? `input${index}` : input.name;
        });
      }
      return method;
    });
  }, [abi])

  useEffect(() => {
    setIsContractLoaded(contract ? true : false)
  }, [contract])

  useEffect(() => {
    (async () => {
      if (!sEthers.ethers.isAddress(contractAddress)) {
        console.log("Invalid contract address")
      }

      setContract(null)

      if (environment === Environment.METAMASK && ethers.isAddress(contractAddress)) {
        setContract(await sWeb3.evm.getContract(contractAddress, abi))
      } else if (environment === Environment.TRONLINK && sEthers.ethers.isTronAddress(contractAddress)) {
        setContract(await sWeb3.tron.getContract(contractAddress, abi))
      }
    })();
  }, [contractAddress, environment])

  const handleSetConstructorArgs = (e: any, index: number) => {
    setConstructorArgs((prev: any) => {
      const newArgs = [...prev]
      newArgs[index] = e.target.value
      return newArgs
    })
  }

  //#region Params State
  const [args, setArgs] = useState<{
    [key: string]: { [key: string]: any }
  }>({})
  const handleArgChange = (method: string, name: string, value: string) => {
    const newArgs = { ...args }

    if (!newArgs[method]) {
      newArgs[method] = {}
    }

    newArgs[method][name] = value
    setArgs(newArgs)
  }
  //#endregion 

  //#region Contract Invoke

  const sendMethod = async (method: string, options: any = {}, params: any) => {
    if (environment === Environment.METAMASK) {
      return await contract[method](...params, options);
    } else if (environment === Environment.TRONLINK) {

      return await contract[method](...params).send(options)
    }

    return null;
  }

  const invokeContract = async (method: string) => {
    if (!contract) {
      return;
    }

    const entry: sEthers.types.ABIEntry | undefined = abi
      .filter((m) => m.type === "function")
      .find((n) => n.name === method)

    if (!entry) {
      return;
    }

    if (!entry) {
      // handles the case where the method is not found in ABI for some reason
      return;
    }

    try {
      let result: any = undefined
      const contractMethod = contract[method]
      let params: any[] = formatParameters(entry, method);

      setRet({ ...ret, [method]: "Waiting Transaction ..." })
      if (msgValue === "" || msgValue === "0") {
        result = await sendMethod(method, {}, params)
      } else {
        result = await sendMethod(method, {
          value: ethers.parseEther(msgValue),
        }, params)
      }

      if (entry.outputs && entry.outputs.length > 0) {
        if (entry.outputs[0].type.includes("int")) {
          result = result.toString() as BigInt
        } else {
          result = result as string
        }

        setRet({ ...ret, [method]: result })
      } else {
        setRet({ ...ret, [method]: "Completed!" })
      }
    } catch (error: any) {
      setRet({
        ...ret,
        [method]: error?.data?.message || error?.message || error.toString(),
      })
      console.error(error)
    }
  }

  const callMethod = async (method: string, ...params: any[]) => {
    if (environment === Environment.METAMASK) {
      return await contract[method].staticCall(...params);
    } else if (environment === Environment.TRONLINK) {
      return await contract[method](...params).call();
    }

    return null;
  }

  const handleStaticCall = async (method: string) => {
    if (!contract) {
      return;
    }

    const entry = abi
      .filter((m) => m.type === "function")
      .find((n) => n.name === method)

    if (!entry) {
      // handles the case where the method is not found in ABI for some reason
      return;
    }

    try {
      let result: any = undefined
      let params: any[] = formatParameters(entry, method);

      setRet({ ...ret, [method]: "Waiting Transaction ..." })

      result = await callMethod(method, ...params)
      setRet({ ...ret, [method]: result })
    } catch (error: any) {
      setRet({
        ...ret,
        [method]: error?.data?.message || error?.message || error.toString(),
      })
      console.error(error)
    }
  }
  //#endregion

  //#region Component Utils
  const formatParameters = (entry: sEthers.types.ABIEntry, method: string) => {
    return entry.inputs.map((input: sEthers.types.ABIParameter) => {
      const val: any = sEthers.abi
        .abiParameterToNative(input, args[method][input.name])
      return val
    })
  }

  const isMethodParameterFilled = (method: string, expectedInputLength: number = 0): boolean =>
    Object.keys(args[method] || {}).length === expectedInputLength && Object.values(args[method] || {}).every((x: string) => x)
  //#endregion

  return (
    <div
      className="flex h-full flex-col gap-4 pb-16"
    // style={{ height: "90vh" }}
    >
      {abi
        .filter((m) => m.type === "constructor")
        .map((abi, index) => {
          return (
            <div key={index}>
              <Button variant="destructive" size="sm" disabled={true}>
                constructor
              </Button>

              <div>
                {abi.inputs.map((input: any, index: number) => {
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <div>{input.name}</div>
                      <Input
                        placeholder={input.type}
                        onChange={(e) => handleSetConstructorArgs(e, index)}
                      />
                    </div>
                  )
                })}

                <div className="py-1 text-center">
                  {ret[abi.name] !== undefined && ret[abi.name]}
                </div>
              </div>
            </div>
          )
        })}

      {abi
        .filter((m) => m.type === "function")
        .map((abi, index) => {
          return <div key={index}>
            <div className="flex space-x-2">
              <Button
                size="sm"
                disabled={!(isContractLoaded && isMethodParameterFilled(abi.name, abi.inputs.length))}
                onClick={() => invokeContract(abi.name)}
              >
                {`${abi.name} ( ${abi.inputs && abi.inputs.length > 0 ? "..." : ""} )`}
              </Button>
              <Button
                size="sm"
                disabled={!(isContractLoaded && isMethodParameterFilled(abi.name, abi.inputs.length))}
                onClick={() => handleStaticCall(abi.name)}
              >
                Static Call
              </Button>
            </div>

            <div>
              {abi.inputs.map((input: sEthers.types.ABIParameter, abiIndex: number) => {
                return <div key={abiIndex} className="flex items-center space-x-2 py-1">
                  <div>{input.name}</div>
                  <Input
                    placeholder={input.type}
                    onChange={(e) =>
                      handleArgChange(abi.name, input.name, e.target.value)
                    }
                  />
                </div>
              })}

              <div className="py-1">
                {ret[abi.name] !== undefined && ret[abi.name].toString()}
              </div>
            </div>
          </div>
        })}
    </div>
  )
}
