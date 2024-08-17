import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, DoorClosedIcon } from "lucide-react"

import { Sources } from "@/lib/core"
import { Environment } from "@/lib/evm"
import { toNative } from "@/lib/evm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFileSystem } from "@/components/core/providers/file-provider"
import { useLogger } from "@/components/core/providers/logger-provider"
import { useTronHook } from "@/components/evm/deploy/hook-tronweb"
import { useWeb3Hook } from "@/components/evm/deploy/hook-web3"
import { SelectedEnvironment } from "@/components/evm/deploy/selected-environment"
import { useEVM } from "@/components/evm/evm-provider"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Abi, AbiFunction, AbiParameter, AbiStateMutability, createPublicClient, custom, getAddress, hexToString, isAddress, toFunctionSelector } from "viem"
import { CollapsibleChevron } from "@/components/core/components/collapsible-chevron"
import { getExplorer } from "@/lib/chains"
import { getTransactionExplorer } from "@/lib/chains/explorer"
import { isAddress as isEthOrTronAddress } from "@/lib/evm/ethers"
import { Title } from "@/components/core/components/title"

const CONSTRUCTOR_METHOD = "constructor"

// Copy from viem
type AbiConstructor = {
  type: 'constructor'
  inputs: readonly AbiParameter[]
  payable?: boolean | undefined
  stateMutability: Extract<AbiStateMutability, 'payable' | 'nonpayable'>
}

interface ContractInvokeProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ContractInvoke({ }: ContractInvokeProps) {
  const evm = useEVM()
  const logger = useLogger()
  const fs = useFileSystem()

  const web3Hook = useWeb3Hook()
  const tronHook = useTronHook()

  const [msgValue, setMsgValue] = useState<number>(0)
  const [contractAddress, setContractAddress] = useState<string>("")
  const [ret, setRet] = useState<{
    [key: string]: any
  }>({})

  const [loadedContractEnvironment, setLoadedContractEnvironment] = useState<Environment | null>(null)

  useEffect(() => {
  }, [evm.selectedCompiledContract])

  //#region Params State
  /**
   * Note we are storing constructor arguments in here as method name "constructor"
   */
  const [contractArguments, setContractArguments] = useState<{
    [contractAddress: string]: { [method: string]: { [parameter: string]: any } }
  }>({})
  const handleArgumentChange = (
    contractAddress: string,
    method: string,
    name: string,
    value: string) => {
    setContractArguments(prevArgs => ({
      ...prevArgs,
      [contractAddress]: {
        ...prevArgs[contractAddress],
        [method]: {
          ...prevArgs[contractAddress]?.[method],
          [name]: value
        }
      }
    }));
  };

  const formatParameters = (entry: AbiFunction | AbiConstructor): any[] => {
    if (!entry) return [];

    const method = entry.type === CONSTRUCTOR_METHOD ? CONSTRUCTOR_METHOD : entry.name;
    const selected = entry.type === CONSTRUCTOR_METHOD
      ? CONSTRUCTOR_METHOD
      : (evm.environment === Environment.METAMASK ? getAddress(selectedContractAddress) : selectedContractAddress);

    const methodArgs = contractArguments[selected]?.[method];
    if (!methodArgs) return [];

    return entry.inputs.map((input: AbiParameter, index: number) =>
      toNative(methodArgs[input.name || index.toString()], input)
    );
  };
  //#endregion

  //#region Contract Calls
  const [isInvoking, setIsInvoking] = useState<boolean>(false)

  const initialiseInvocation = (method: string) => {
    if (!loadedContractEnvironment) {
      throw new Error("No contract loaded")
    }

    if (!selectedAbiParameter) {
      throw new Error("No method selected")
    }

    setIsInvoking(true)
    logger.info(<div className="flex gap-2">
      <ArrowRight size={18} /> <div>{method}()</div>
    </div>)
  }

  const invokeSend = async (method: string) => {
    try {
      initialiseInvocation(method);

      let invoker = web3Hook.executeSend
      if (evm.environment === Environment.METAMASK) {
        invoker = web3Hook.executeSend
      } else if (evm.environment === Environment.TRONLINK) {
        invoker = tronHook.executeSend
      }

      // This should be the transaction hash
      const result = await invoker(selectedContractAddress, method, formatParameters(selectedAbiParameter!), msgValue)
      const tx = result.toString()

      // formatOutput(selectedAbiParameter, result)
      const hex = await window.ethereum.request({ method: "eth_chainId" })
      const chainId = parseInt(hex, 16).toString()
      const txExplorer = getTransactionExplorer(chainId, tx)
      if (txExplorer) {
        logger.success(<a className="underline" href={txExplorer} target="_blank">{tx}</a>)
      } else {
        logger.success(tx)
      }
    } catch (error: any) {
      logger.error(handleError(error), true)
    } finally {
      setSelectedAbiParameter(null)
      setIsInvoking(false)
    }
  }

  const invokeCall = async (method: string) => {
    try {
      initialiseInvocation(method);

      let invoker = web3Hook.executeCall
      if (evm.environment === Environment.METAMASK) {
        invoker = web3Hook.executeCall
      } else if (evm.environment === Environment.TRONLINK) {
        invoker = tronHook.executeCall
      }

      // This should be the transaction hash
      const result = await invoker(selectedContractAddress, method, formatParameters(selectedAbiParameter!))
      console.log("result", result)

      formatOutput(selectedAbiParameter!, result)
    } catch (error: any) {
      logger.error(handleError(error), true)
    } finally {
      setSelectedAbiParameter(null)
      setIsInvoking(false)
    }
  }

  const formatOutput = (entry: AbiFunction, result: any) => {
    console.log("formatOutput", entry, result)
    if (entry.outputs && entry.outputs.length > 0) {
      console.log("output is array", typeof result)
      if (typeof result === "object") {
        result = JSON.stringify(result, (_, v) =>
          typeof v === "bigint" ? v.toString() : v
        )
      } else if (entry.outputs[0].type.includes("int")) {
        result = result.toString() as BigInt
      } else {
        console.log("output is string", typeof result)
        result = result as string
      }

      logger.info(<div className="flex gap-2">
        <ArrowLeft size={18} /> <div>{result}</div>
      </div>)
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
      let result;

      // Note empty contractAddress value means this is a new contract (deploying)
      let shouldUpload = contractAddress ? false : true

      const contractConstructor = (evm.selectedCompiledContract.abi as Abi)
        .find(abi => abi.type === CONSTRUCTOR_METHOD)
      const args = contractAddress || !contractConstructor
        ? []
        : formatParameters(contractConstructor)
      if (evm.environment === Environment.METAMASK) {
        result = await web3Hook.doDeploy({
          contractAddress,
          abi: evm.selectedCompiledContract?.abi,
          bytecode: evm.selectedCompiledContract?.evm?.bytecode?.object,
          args,
        })

        if (result.contract) {
          setContractAddress(result.contract)
          logger.success(`Contract deployed at ${result.contract}`)

          setContractArguments({
            ...contractArguments,
            [getAddress(result.contract)]: {}
          })
        } else {
          logger.error(`Error deploying contract: ${result.transactionHash}`)
        }
      } else if (evm.environment === Environment.TRONLINK) {
        result = await tronHook.doDeploy({
          contractAddress,
          abi: evm.selectedCompiledContract?.abi,
          bytecode: evm.selectedCompiledContract?.evm?.bytecode?.object,
          args,
          name: evm.target,
        })

        if (result.contract) {
          setContractAddress(result.contract)
          logger.success(`Contract deployed at ${result.contract}`)

          setContractArguments({
            ...contractArguments,
            [result.contract]: {}
          })
        } else {
          logger.error(`Error deploying contract: ${result.transactionHash}`)
        }
      }

      setLoadedContractEnvironment(evm.environment)
      if (shouldUpload && evm.useSolidityDB && result && result.contract) {
        await uploadToSolidityDB(result.contract)
      }
    } catch (error: any) {
      logger.error(handleError(error), true)
    }
  }

  const handleDeployDisabled = () => {
    if (isEthOrTronAddress(contractAddress)) {
      return false
    }

    // This case handle contracts that have no constructor
    const hasConstructor = (evm.selectedCompiledContract.abi as Abi).some(abi => abi.type === CONSTRUCTOR_METHOD)
    if (evm.selectedCompiledContract && !hasConstructor) {
      return false
    }

    return true
  }

  const uploadToSolidityDB = async (deployedAddress: string = "") => {
    const payload: { bytecodes: string[] } = { bytecodes: [] }

    try {
      // After Deploying the contract bytecode to be safe
      if (deployedAddress) {
        let contractBytecode: string = "0x"
        if (evm.environment === Environment.TRONLINK) {
          const { bytecode }: any = await window.tronWeb.trx.getContract(
            deployedAddress
          )
          contractBytecode = bytecode.toString()
        } else if (evm.environment === Environment.METAMASK) {
          // const web3 = new Web3(window.ethereum)
          const web3 = createPublicClient({
            transport: custom(window.ethereum!),
          })
          const code = await web3.getCode({ address: deployedAddress as `0x${string}` })
          contractBytecode = code?.toString() || "0x"
        }
        if (contractBytecode !== "0x") {
          payload.bytecodes.push(contractBytecode.slice(2))
        }
      }
    } catch (error) {
      console.log("Error loading deployed contract bytecode", error)
    }

    // if (evm.selectedCompiledContract && evm.selectedCompiledContract?.evm?.bytecode?.object) {
    //   payload.bytecodes.push(evm.selectedCompiledContract?.evm?.bytecode?.object)
    // }
    // if (evm.selectedCompiledContract && evm.selectedCompiledContract?.evm?.deployedBytecode?.object) {
    //   payload.bytecodes.push(evm.selectedCompiledContract?.evm?.deployedBytecode?.object)
    // }

    // Don't upload if no bytecode to upload
    if (payload.bytecodes.length === 0)
      throw new Error("Failed to process sources")

    const rawSources = await fs.generateSources()
    const metadata = JSON.parse(evm.selectedCompiledContract.metadata)
    if (!metadata) throw new Error("No metadata found")

    // Remove hash from metadata
    let processingSuccessful = true
    const sources: Sources = {}
    Object.keys(metadata.sources as Sources).forEach((source) => {
      if (!rawSources[source]) {
        processingSuccessful = false
        return
      }

      sources[source] = rawSources[source]
    })

    if (!processingSuccessful) throw new Error("Failed to process sources")

    // Clean out metadata
    metadata.sources = sources
    if (metadata.metadata?.bytecodeHash) {
      delete metadata.metadata.bytecodeHash
    }

    console.log("metadata", metadata)

    // Transform to blob and send to Vaulidity
    const formData = new FormData()
    formData.append(
      "file",
      new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      })
    )
    formData.append("payload", JSON.stringify(payload))

    const response = await fetch("/api/smart-contract/store", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const { message } = await response.json()
      throw new Error(message)
    }

    // Debugging in console
    const data = await response.json()
    console.log(data)
  }
  //#endregion

  const handleError = (error: any) => {
    let msg = error && error.toString()
    if (typeof error === "object") {
      msg = error?.message.toString() || "Error deploying contract"
    }

    return `${msg.toString()}`
  }

  const [selectedContractAddress, setSelectedContractAddress] = useState<string>("")
  const [selectedAbiParameter, setSelectedAbiParameter] = useState<AbiFunction | null>(null)

  const [selectedConstructor, setSelectedConstructor] = useState<AbiConstructor | null>(null)

  const handleRemoveContract = (contractAddress: string) => {
    if (evm.environment === Environment.METAMASK) {
      web3Hook.removeContract(contractAddress)
    }
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

      <div className="flex items-center justify-center">
        <div className="py-2 font-semibold text-grayscale-350">Value (wei)</div>
        <Input className="h-9 rounded-md px-3"
          placeholder="Value"
          type="number"
          value={msgValue}
          onChange={(e) => setMsgValue(parseInt(e.target.value) || 0)}
        />
      </div>

      {/* Should be typed: AbiConstructor */}
      {(evm.selectedCompiledContract.abi as Abi).filter(abi => abi.type === CONSTRUCTOR_METHOD)
        .map((abi, index: number) => {
          return <div key={index}>
            <Button onClick={() => setSelectedConstructor(abi)}>
              {CONSTRUCTOR_METHOD}
            </Button>
          </div>
        })}

      <Title text="Deployed Contracts" />
      {Object.entries(evm.environment === Environment.METAMASK ? web3Hook.contracts : tronHook.contracts).map(([key, val], index) => {
        return <CollapsibleChevron key={index} name={key} onClosed={() => handleRemoveContract(key)}>
          <div className="flex flex-wrap gap-2">
            {(val.abi as Abi)
              .filter(abi => abi.type === "function")
              .map((abi: AbiFunction, methodsIndex: number) => {
                return <Button
                  key={methodsIndex}
                  onClick={() => {
                    console.log("selectedContractAddress", abi)
                    setSelectedContractAddress(key)
                    setSelectedAbiParameter(abi)
                  }}
                  size="sm">
                  {abi.name}
                </Button>
              })}
          </div>
        </CollapsibleChevron>
      })}

      <Dialog open={!!selectedAbiParameter} onOpenChange={() => {
        setSelectedContractAddress("")
        setSelectedAbiParameter(null)
      }}>
        <DialogContent className="max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedAbiParameter?.name || "Unknown"} ({selectedAbiParameter && toFunctionSelector(selectedAbiParameter)})</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          {selectedAbiParameter && <>
            {selectedAbiParameter.inputs.map(
              (input: AbiParameter, abiIndex: number) => {
                return (
                  <div
                    key={abiIndex}
                    className="flex items-center space-x-2 py-1"
                  >
                    <div>{input.name}</div>

                    <Input
                      value={contractArguments[selectedContractAddress]?.[selectedAbiParameter.name]?.[input.name || abiIndex.toString()]}
                      placeholder={input.type}
                      onChange={(e) =>
                        handleArgumentChange(
                          selectedContractAddress,
                          selectedAbiParameter.name,
                          input.name || abiIndex.toString(),
                          e.target.value
                        )
                      }
                    />
                  </div>
                )
              }
            )}

            <Button onClick={() => {
              if (selectedAbiParameter.stateMutability === "view") {
                invokeCall(selectedAbiParameter.name)
                return
              } else {
                invokeSend(selectedAbiParameter.name)
              }
            }}
              disabled={isInvoking}>
              {isInvoking ? "Invoking..." : selectedAbiParameter.stateMutability === "view" ? "Call" : "Send"}
            </Button>
          </>}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedConstructor} onOpenChange={() => {
        setSelectedConstructor(null)
      }}>
        <DialogContent className="max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          {selectedConstructor && <>
            {selectedConstructor.inputs.map(
              (input: AbiParameter, abiIndex: number) => {
                return (
                  <div key={abiIndex} className="flex items-center space-x-2 py-1">
                    <div>{input.name}</div>

                    <Input
                      value={contractArguments[CONSTRUCTOR_METHOD]?.[CONSTRUCTOR_METHOD]?.[input.name || abiIndex.toString()]}
                      placeholder={input.type}
                      onChange={(e) =>
                        handleArgumentChange(
                          CONSTRUCTOR_METHOD,
                          CONSTRUCTOR_METHOD,
                          input.name || abiIndex.toString(),
                          e.target.value
                        )
                      }
                    />
                  </div>
                )
              }
            )}

            <Button onClick={handleDeploy}>
              Call
            </Button>
          </>}
        </DialogContent>
      </Dialog>
    </div>
  )
}
