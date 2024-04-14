import { useEffect, useState } from "react"
import { Send } from "lucide-react"
import { Contract } from "web3"

import { ABIEntry, Environment } from "@/lib/evm"
import { deploy, load } from "@/lib/evm/ethers"
import * as evmUtil from "@/lib/evm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLogger } from "@/components/core/providers/logger-provider"

import { useEVM } from "../evm-provider"
import { useTronHook } from "./hook-tronweb"
import { useWeb3Hook } from "./hook-web3"
import { SelectedEnvironment } from "./selected-environment"
import { useFileSystem } from "@/components/core/providers/file-provider"
import { language, settings } from "@/lib/evm/metadata"

const CONSTRUCTOR_METHOD = "constructor"

interface ArgumentInterface {
  [key: string]: { [key: string]: any }
}

interface ContractInvokeProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ContractInvoke({ }: ContractInvokeProps) {
  const evm = useEVM()
  const logger = useLogger()
  const fs = useFileSystem()

  const web3Hook = useWeb3Hook()
  const tronHook = useTronHook()

  const [processedABI, setProcessedABI] = useState<ABIEntry[]>([])
  const [processedConstructor, setProcessedConstructor] =
    useState<evmUtil.ABIEntry>({} as evmUtil.ABIEntry)

  const [msgValue, setMsgValue] = useState<number>(0)
  const [contractAddress, setContractAddress] = useState<string>("")
  const [ret, setRet] = useState<{
    [key: string]: any
  }>({})

  const [loadedContractEnvironment, setLoadedContractEnvironment] =
    useState<Environment | null>(null)

  useEffect(() => {
    setContractArguments({} as ArgumentInterface)
    setProcessedABI(
      evm.selectedCompiledContract.abi.map((method: evmUtil.ABIEntry) => {
        if (method.type === "function" && method.inputs) {
          method.inputs.forEach(
            (input: evmUtil.ABIParameter, index: number) => {
              input.name = input.name === "" ? `input${index}` : input.name
            }
          )
        }
        return method
      })
    )

    // There should any be one constructor
    setProcessedConstructor(
      evm.selectedCompiledContract.abi
        .filter(
          (method: evmUtil.ABIEntry) => method.type === "constructor"
        )
        .pop()
    )
  }, [evm.selectedCompiledContract])

  //#region Params State
  /**
   * Note we are storing constructor arguments in here as method name "constructor"
   */
  const [contractArguments, setContractArguments] = useState<{
    [key: string]: { [key: string]: any }
  }>({})
  // const [contractArguments, setContractArguments] = useState<ArgumentInterface>({} as ArgumentInterface)
  const handleArgumentChange = (
    method: string,
    name: string,
    value: string
  ) => {
    const newArgs = { ...contractArguments }

    if (!newArgs.hasOwnProperty(method)) {
      newArgs[method] = {}
    }

    newArgs[method][name] = value
    setContractArguments(newArgs)
  }

  const formatParameters = (entry: evmUtil.ABIEntry, method: string) => {
    console.log("formatParameters", entry, contractArguments[method])
    if (!entry || !contractArguments.hasOwnProperty(method)) {
      return []
    }

    return entry.inputs.map((input: evmUtil.ABIParameter) => {
      const val: any = evmUtil.abiParameterToNative(
        input,
        contractArguments[method][input.name]
      )
      return val
    })
  }

  const areContractMethodsFilled = (
    method: string,
    expectedInputLength: number = 0
  ): boolean =>
    Object.keys(contractArguments[method] || {}).length ===
    expectedInputLength &&
    Object.values(contractArguments[method] || {}).every((x: string) => x)
  //#endregion

  //#region Contract Calls
  const invokeContract = async (method: string) => {
    if (!loadedContractEnvironment) {
      logger.warn("No contract loaded")
      return
    }

    const entry: evmUtil.ABIEntry | undefined = processedABI
      .filter((m) => m.type === "function")
      .find((n) => n.name === method)

    if (!entry) {
      logger.warn("ABI for method not found")
      return
    }

    try {
      logger.info(`➡️ ${method}()`)
      if (
        loadedContractEnvironment &&
        evm.environment === Environment.METAMASK
      ) {
        const result = await web3Hook.executeSend(
          method,
          formatParameters(entry, method),
          msgValue
        )

        formatOutput(entry, result)
      } else if (
        loadedContractEnvironment &&
        evm.environment === Environment.TRONLINK
      ) {
        const result = await tronHook.executeSend(
          method,
          formatParameters(entry, method),
          msgValue
        )

        formatOutput(entry, result)
      }
    } catch (error: any) {
      logger.error(handleError(error))
    }
  }

  const handleStaticCall = async (method: string) => {
    if (!loadedContractEnvironment) {
      logger.warn("No contract loaded")
      return
    }

    const entry: evmUtil.ABIEntry | undefined = processedABI
      .filter((m) => m.type === "function")
      .find((n) => n.name === method)

    if (!entry) {
      logger.warn("ABI for method not found")
      return
    }

    try {
      logger.info(`➡️ ${method}()`)
      if (
        loadedContractEnvironment &&
        evm.environment === Environment.METAMASK
      ) {
        const result = await web3Hook.executeCall(
          method,
          formatParameters(entry, method)
        )

        formatOutput(entry, result)
      } else if (
        loadedContractEnvironment &&
        evm.environment === Environment.TRONLINK
      ) {
        const result = await tronHook.executeCall(
          method,
          formatParameters(entry, method)
        )

        formatOutput(entry, result)
      }
    } catch (error: any) {
      logger.error(handleError(error))
    }
  }

  const formatOutput = (entry: evmUtil.ABIEntry, result: any) => {
    console.log("formatOutput", entry, result)
    if (entry.outputs && entry.outputs.length > 0) {
      if (entry.outputs[0].type.includes("int")) {
        result = result.toString() as BigInt
      } else {
        result = result as string
      }

      logger.info(`⬅️ ${result}`)
      setRet({ ...ret, [entry.name]: result })
    } else {
      logger.success(result)
      setRet({ ...ret, [entry.name]: result })
    }
  }
  //#endregion

  //#region Deploy
  const handleDeploy = async () => {
    if (!evm.selectedCompiledContract?.abi) {
      logger.warn("No contract selected")
      return
    }
    if (!window.ethereum || !window.tronWeb) {
      logger.warn("No ethereum or tron provider found")
      return
    }

    try {
      const args = contractAddress
        ? []
        : formatParameters(processedConstructor, CONSTRUCTOR_METHOD)
      if (evm.environment === Environment.METAMASK) {
        const result = await web3Hook.doDeploy({
          contractAddress,
          abi: evm.selectedCompiledContract?.abi,
          bytecode: evm.selectedCompiledContract?.evm?.bytecode?.object,
          args,
        })

        if (result.contract) {
          setContractAddress(result.contract.options.address || "")
          setLoadedContractEnvironment(evm.environment)
          logger.success(
            `Contract deployed at ${result.contract.options.address}`
          )
        } else {
          logger.error(`Error deploying contract: ${result.transactionHash}`)
        }
      } else if (contractAddress && evm.environment === Environment.TRONLINK) {
        const result = await tronHook.doDeploy({
          contractAddress,
          abi: evm.selectedCompiledContract?.abi,
          bytecode: evm.selectedCompiledContract?.evm?.bytecode?.object,
          args,
          name: evm.target,
        })

        if (result.contract) {
          setLoadedContractEnvironment(evm.environment)
          logger.success(`Contract deployed at ${result.contract.address}`)
        } else {
          logger.error(`Error deploying contract: ${result.transactionHash}`)
        }
      }

      // Upload to SolidityDB
      await uploadToSolidityDB()
    } catch (error: any) {
      logger.error(handleError(error))
    }
  }

  const handleDeployDisabled = () => {
    if (evmUtil.isAddress(contractAddress)) {
      return false
    }

    // This case handle contracts that have no constructor
    if (evm.selectedCompiledContract && !processedConstructor) {
      return false
    }

    console.log(
      "processedConstructor",
      Object.values(contractArguments[CONSTRUCTOR_METHOD] || {}).every(
        (x: string) => x
      )
    )
    if (
      processedConstructor &&
      processedConstructor.type === CONSTRUCTOR_METHOD &&
      areContractMethodsFilled(
        CONSTRUCTOR_METHOD,
        processedConstructor.inputs.length
      )
    ) {
      return false
    }

    return true
  }

  const uploadToSolidityDB = async () => {
    const payload: { bytecodes: string[] } = { bytecodes: [] }
    if (evm.selectedCompiledContract && evm.selectedCompiledContract?.evm?.bytecode?.object) {
      payload.bytecodes.push(evm.selectedCompiledContract?.evm?.bytecode?.object)
    }
    if (evm.selectedCompiledContract && evm.selectedCompiledContract?.evm?.deployedBytecode?.object) {
      payload.bytecodes.push(evm.selectedCompiledContract?.evm?.deployedBytecode?.object)
    }

    if (payload.bytecodes.length === 0) {
      console.log("No bytecodes to upload")
      return // Important uncomment this line
    }

    if (!evm.target || !evm.targetCompiltion) {
      console.log("No target compilation")
      return
    }

    const sources = await fs.generateSources()
    const metadata: any = {
      language: "Solidity",
      sources,
      abi: evm.selectedCompiledContract.abi,
      compiler: {
        version: evm.compilerVersion
      },
      settings: {
        optimizer: {
          enabled: evm.compilerOptimised,
          runs: evm.compilerRuns
        },
        outputSelection: {
          "*": {
            "*": ["*"]
          }
        }

      }
    }
    if (evm.selectedCompiledContract && evm.selectedCompiledContract.abi) {
      metadata.abi = evm.selectedCompiledContract.abi as string
    }

    if (!metadata.settings) {
      metadata.settings = {}
    }

    metadata.settings.compilationTarget = {
      [evm.targetCompiltion]: evm.target,
    }

    const blob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    })

    const formData = new FormData()
    formData.append("file", blob)
    formData.append("payload", JSON.stringify(payload))

    const response = await fetch("/api/smart-contract/store", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()
    console.log(data)
  }
  //#endregion

  const handleError = (error: any) => {
    let msg = error && error.toString()
    if (typeof error === "object") {
      msg = error?.message.toString() || "Error deploying contract"
    }

    return `❌ ${msg.toString()}`
  }

  return (
    <div>
      <div className="my-4">
        <SelectedEnvironment />
      </div>

      <div className="flex">
        <Button
          size="sm"
          onClick={handleDeploy}
          variant="default"
          disabled={handleDeployDisabled()}
        >
          Deploy
        </Button>
        <Input
          className="h-9 rounded-md px-3"
          placeholder="Contract Address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
      </div>

      <div className="py-2 font-semibold text-grayscale-350">Value (wei)</div>
      <Input
        className="h-9 rounded-md px-3"
        placeholder="Value"
        type="number"
        value={msgValue}
        onChange={(e) => setMsgValue(parseInt(e.target.value) || 0)}
      />

      {processedConstructor &&
        processedConstructor.type &&
        processedConstructor.type === CONSTRUCTOR_METHOD && (
          <div>
            <Button
              size="sm"
              variant="warning"
              disabled={
                !(
                  false ||
                  areContractMethodsFilled(
                    CONSTRUCTOR_METHOD,
                    processedConstructor.inputs.length
                  )
                )
              }
              onClick={() => handleDeploy()}
            >
              {CONSTRUCTOR_METHOD}
            </Button>

            <div>
              {processedConstructor.inputs.map(
                (input: evmUtil.ABIParameter, abiIndex: number) => {
                  return (
                    <div
                      key={abiIndex}
                      className="flex items-center space-x-2 py-1"
                    >
                      <div>{input.name}</div>
                      <Input
                        placeholder={input.type}
                        onChange={(e) =>
                          handleArgumentChange(
                            CONSTRUCTOR_METHOD,
                            input.name,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )
                }
              )}
            </div>
          </div>
        )}

      {processedABI
        .filter((m) => m.type === "function")
        .map((abi, index) => {
          return (
            <div key={index}>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  disabled={
                    !(
                      loadedContractEnvironment &&
                      areContractMethodsFilled(abi.name, abi.inputs.length)
                    )
                  }
                  onClick={() => invokeContract(abi.name)}
                >
                  {`${abi.name} ( ${abi.inputs && abi.inputs.length > 0 ? "..." : ""
                    } )`}
                </Button>
                <Button
                  className="cursor-pointer border-0 hover:bg-grayscale-100"
                  size="icon"
                  variant="ghost"
                  disabled={
                    !(
                      loadedContractEnvironment &&
                      areContractMethodsFilled(abi.name, abi.inputs.length)
                    )
                  }
                  onClick={() => handleStaticCall(abi.name)}
                >
                  <Send />
                </Button>
              </div>

              <div>
                {abi.inputs.map(
                  (input: evmUtil.ABIParameter, abiIndex: number) => {
                    return (
                      <div
                        key={abiIndex}
                        className="flex items-center space-x-2 py-1"
                      >
                        <div>{input.name}</div>
                        <Input
                          placeholder={input.type}
                          onChange={(e) =>
                            handleArgumentChange(
                              abi.name,
                              input.name,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    )
                  }
                )}

                <div className="py-1">
                  {ret[abi.name] !== undefined && ret[abi.name].toString()}
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}
