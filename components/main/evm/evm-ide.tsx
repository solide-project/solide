"use client"

import path from "path"
import { useEffect, useState } from "react"
import { Signer, ethers } from "ethers"
import { Code, Download, File, FunctionSquare, Star } from "lucide-react"

import { CompileError, CompileInput, CompileResult } from "@/lib/interfaces"
import {
  GetSolidityJsonInputFormat,
  JSONParse,
  cn,
  solcVersion,
} from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { CompileErrors } from "@/components/main/compile/errors"
import { ContractInvoke } from "@/components/main/evm/components/contract-invoke"
import { FileTree } from "@/components/main/file-tree"
import { ContentLink } from "@/components/main/shared/nav/content-link"
import { SelectedChain } from "@/components/main/shared/nav/selected-chain"
import { ThemeToggle } from "@/components/theme-toggle"

import { useFileSystem } from "../../file-provider"
import { IDE } from "../shared/ide"
import { IDEHeader } from "../shared/ide-header"
import { useResizables } from "../shared/use-resizeable.hook"
import { EVMMetadata } from "./components/evm-metadata"
import { EVMSettings } from "./components/evm-settings"
import { useEVM } from "./provider/evm-provider"
import { DecompileOutput } from "./components/selected-contract"
import { FileDownloader } from "@/lib/helpers/file-downloader"
import { QueryParamBuilder } from "@/lib/helpers/query-param-builder"
import { Service } from "@/lib/services/abi/abi-service"
import { ByteCodeContract } from "./components/bytecode-contract"

interface SolideIDEProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Entire GitHub URL or an contract address
   */
  url?: string
  /**
   * Chain ID of contract address, should only be used when smart contract is address
   */
  chainId?: string
  title?: string
  content: string
  version?: string
  bytecodeId?: string
}

export function SolideIDE({
  url,
  content,
  version,
  chainId,
  title = "Contract",
  bytecodeId,
}: SolideIDEProps) {
  const { compilerSetting } = useEVM()

  const {
    isFileSytemVisible,
    toggleFileSytemVisible,
    isEditorVisible,
    toggleEditorVisible,
    isContractVisible,
    toggleIsContractVisible,
  } = useResizables()

  const {
    fs,
    initSolIDE,
    initIDE,
    handleIDEDisplay,
  } = useFileSystem()

  const [solidityInput, setSolidityInput] = useState<CompileInput | undefined>()

  useEffect(() => {
    (async () => {
      // At the start, we need to check if the content is JSON format
      const match = title.match(/\/([^:]+\.sol):/)
      const solFilePath = match ? match[1] : title
      handleIDEDisplay({ content, filePath: solFilePath })

      if (!content) return

      if (version) {
        console.log("Setting compiler version", version)
        await compilerSetting.setCompilerVersion(version)
      }

      //#region Check if the smart contract is JSON format
      const input: CompileInput = GetSolidityJsonInputFormat(content)

      if (input) {
        setSolidityInput(input)
        if (input.language === "Solidity") {
          initSolIDE(input.sources, title)
        } else {
          initIDE(input.sources, title)
        }
      } else {
        let data: CompileInput = JSONParse(content) as CompileInput
        if (!data) {
          data = {
            language: "Solidity",
            sources: {
              [`${title}.sol`]: {
                content: content,
              },
            },
          }
        }

        setSolidityInput(data)
        initIDE(data.sources, title)
      }
      //#endregion
    })()
  }, [content])

  const [compiling, setCompiling] = useState<boolean>(false)
  const [compileInfo, setCompileInfo] = useState<CompileResult | undefined>()
  const [compileError, setCompileError] = useState<CompileError | undefined>()

  const setCompilingState = ({
    compiling = false,
    errors,
    info,
    contractAddress = "",
    contract,
  }: {
    compiling?: boolean
    errors?: CompileError,
    info?: CompileResult,
    contractAddress?: string
    contract?: ethers.Contract
  }) => {
    setCompiling(compiling)
    setCompileError(errors)
    setCompileInfo(info)
    setContractAddress(contractAddress)
    setContract(contract)
  }

  const compileInput = async ({
    source,
    title,
    compileVersion,
    optimizer = false,
    runs = 200,
    viaIR = false,
  }: {
    source: any
    title: string,
    compileVersion?: string,
    optimizer?: boolean,
    runs?: number,
    viaIR?: boolean   // Note that this is not used in the current implementation
  }): Promise<Response> => {
    const queryBuilder = new QueryParamBuilder()
    let queryString = queryBuilder.addParam('version', compileVersion);
    if (optimizer) {
      queryBuilder
        .addParam('optimizer', optimizer)
        .addParam('runs', runs.toString());
    }
    if (viaIR) {
      queryBuilder.addParam('viaIR', viaIR)
    }

    const formData = new FormData()
    const blob = new Blob([JSON.stringify(source)], {
      type: "text/plain",
    })
    formData.append("file", blob)
    formData.append("title", title)

    return fetch(`/api/compile/${queryString.build()}`, {
      method: "POST",
      body: formData,
    })
  }

  const compile = async () => {
    if (compiling) return

    setCompilingState({ compiling: true })

    const sources = await fs.generateSources()
    const response = await compileInput({
      source: { ...solidityInput, sources },
      title: title,
      compileVersion: compilerSetting.compilerVersion,
      optimizer: compilerSetting.input?.settings?.optimizer?.enabled,
      runs: compilerSetting.input?.settings?.optimizer?.runs
    })

    if (!response.ok) {
      const data = (await response.json()) as CompileError
      setCompilingState({ errors: data, })
      return
    }

    const data = await response.json()
    const constructors: any[] = data.data.abi.filter(
      (m: any) => m.type === "constructor"
    )
    if (constructors.length > 0) {
      const contractConstructor = constructors.pop()
      setConstructorABI(contractConstructor)
    }

    const outputs: DecompileOutput = data.output as DecompileOutput;
    console.log(outputs)
    setOutput(outputs)
    setCompilingState({ info: data, })
  }

  const [msgValue, setMsgValue] = useState<string>("")

  const [contractAddress, setContractAddress] = useState<string>("")
  const [constructorArgs, setConstructorArgs] = useState<any[]>([])
  const [constructorABI, setConstructorABI] = useState<{
    inputs: any[]
  }>({
    inputs: [],
  } as any)

  const [output, setOutput] = useState<DecompileOutput | null>(null)
  const [selectedCompiledInfo, setSelectedCompiledInfo] = useState<any | null>(null);
  const [contract, setContract] = useState<ethers.Contract | undefined>()
  const [contractKey, setContractKey] = useState<number>(0)

  const setDeployState = async (contract: ethers.Contract) => {
    setContract(contract)
    const address = await contract.getAddress()
    setContractAddress(address)
    setContractKey(contractKey + 1)
  }

  const deploy = async () => {
    if (compileInfo === undefined) return
    if (!window.ethereum) return

    // setContract(undefined)
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = await provider.getSigner()

    if (!ethers.isAddress(contractAddress)) {
      console.log(
        constructorArgs,
        constructorABI,
        constructorArgs.length,
        (constructorABI.inputs || []).length
      )
      let params: any[] = constructorABI.inputs.map((input: Service.ABIService.ABIParameter, index: number) => {
        const val: any = Service.ABIService
          .abiParameterToNative(input, constructorArgs[index])
        return val
      })

      console.log(params)
      const factory = new ethers.ContractFactory(
        compileInfo.data.abi,
        compileInfo.data.evm.bytecode.object,
        signer
      )
      const contract: ethers.BaseContract = await factory.deploy(...params);
      const address = await contract.getAddress()
      await setDeployState(new ethers.Contract(
        address,
        compileInfo.data.abi,
        signer
      ))
      await testUpload();
    } else {
      const contract = new ethers.Contract(
        contractAddress,
        compileInfo.data.abi,
        signer
      )
      await setDeployState(contract)
    }
  }

  const downloadFile = async () => {
    const sourceBlob: Blob = await fs.download()
    const downloader = new FileDownloader()
    downloader.downloadFile({
      source: sourceBlob,
      name: "contract.zip",
    })
  }

  const testUpload = async () => {
    const payload: {
      bytecodes: string[],
    } = {
      bytecodes: []
    }
    if (compileInfo && compileInfo?.data?.evm?.bytecode?.object) {
      payload.bytecodes.push(compileInfo?.data?.evm?.bytecode?.object)
    }
    if (compileInfo && compileInfo?.data?.evm?.deployedBytecode?.object) {
      payload.bytecodes.push(compileInfo?.data?.evm?.deployedBytecode?.object)
    }

    if (payload.bytecodes.length === 0) {
      console.log("No bytecodes to upload")
      // return;  // Important uncomment this line
    }

    const sources = await fs.generateSources()
    const metadata: any = {
      ...solidityInput,
      sources,
      compiler: {
        version: compilerSetting.compilerVersion,
      }
    }

    const onChainEntry = Object.entries(sources).find(([key, _]) =>
      path.basename(key).startsWith(path.basename(title))
    )
    if (!onChainEntry) {
      console.log("Cannot find upload to Solide Smart Contract DB")
      return;
    }

    if (!metadata.settings) {
      metadata.settings = {}
    }

    metadata.settings.compilationTarget = {
      [onChainEntry[0]]: title
    }

    const blob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    })

    const formData = new FormData();
    formData.append('file', blob);
    formData.append('payload', JSON.stringify(payload));

    const response = await fetch("/api/smart-contract/store", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()
    console.log(data)
  }

  return (
    <div className="flex max-h-screen min-h-screen">
      <div
        className={cn(
          "mx-0 max-h-screen",
          `${isFileSytemVisible ? "" : "hidden"}`
        )}
      >
        <div className="h-full">
          <div className="h-full overflow-x-auto overflow-y-auto p-4 pb-8">
            <FileTree name={path.basename(url || "")} />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "flex max-h-screen flex-col items-center gap-2 px-1 py-4 lg:px-2"
        )}
      >
        <Button size="icon" variant="ghost" onClick={toggleFileSytemVisible}>
          <File />
        </Button>

        {/* <Button size="icon" variant="ghost" onClick={testUpload}>
          <Star />
        </Button> */}

        <Separator className="my-4" />

        <Button size="icon" variant="ghost" onClick={toggleEditorVisible}>
          <Code />
        </Button>

        <Button size="icon" variant="ghost" onClick={toggleIsContractVisible}>
          <FunctionSquare />
        </Button>

        {url && <ContentLink url={url} chainId={chainId} />}

        <Button size="icon" variant="ghost" onClick={downloadFile}>
          <Download />
        </Button>

        <div className="mt-auto flex flex-col items-center gap-2">
          {bytecodeId && <ByteCodeContract id={bytecodeId} />}
          <SelectedChain />
          <ThemeToggle />
          <EVMSettings solcVersion={version || solcVersion} />
        </div>
      </div>
      <ResizablePanelGroup direction="horizontal" className="">
        <ResizablePanel
          defaultSize={70}
          minSize={5}
          className={cn("relative", `${isEditorVisible ? "" : "hidden"}`)}
        >
          <IDEHeader />
          <IDE />
          <Button
            className="absolute"
            style={{ bottom: "16px", right: "16px" }}
            size="sm"
            onClick={compile}
            disabled={compiling}
          >
            {compiling ? "Compiling ..." : "Compile"}
          </Button>
        </ResizablePanel>
        {isContractVisible && isEditorVisible && <ResizableHandle withHandle />}
        <ResizablePanel
          defaultSize={30}
          minSize={5}
          className={cn("", `${isContractVisible ? "" : "hidden"}`)}
        >
          {compileError && compileError.details && (
            <CompileErrors errors={compileError.details} />
          )}
          {compileInfo ? (
            <div className="flex max-h-screen flex-col gap-4 overflow-y-auto px-4">
              <EVMMetadata
                contractAddress={contractAddress}
                items={[
                  {
                    title: "ABI",
                    payload: JSON.stringify(compileInfo.data?.abi || "{}"),
                  },
                  {
                    title: "Bytecode",
                    payload: compileInfo.data?.evm?.bytecode?.object || "",
                  },
                  { title: "Flatten", payload: compileInfo.flattenContract },
                ]}
              />

              {/* {output &&
                <SelectedContract output={output} onSet={setSelectedCompiledInfo} />} */}
              <div className="flex">
                <Button
                  size="sm"
                  onClick={deploy}
                  variant="default"
                  disabled={
                    ethers.isAddress(contractAddress) ||
                      constructorArgs.length ===
                      (constructorABI.inputs || []).length
                      ? false
                      : true
                  }
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

              <div className="flex">
                <Button size="sm" onClick={() => { }} variant="default">
                  msg.value
                </Button>
                <Input
                  type="number"
                  className="h-9 rounded-md px-3"
                  placeholder="Contract Address"
                  value={msgValue}
                  onChange={(e) => setMsgValue(e.target.value)}
                />
              </div>

              <ContractInvoke
                setConstructorArgs={setConstructorArgs}
                key={contractKey}
                contract={contract}
                abi={selectedCompiledInfo?.data?.abi || compileInfo?.data?.abi || []}
                msgValue={msgValue}
              />
            </div>
          ) : (
            <div
              className={cn(
                "flex min-h-screen items-center justify-center py-4",
                `${compileError && compileError.details && "hidden"}`
              )}
            >
              Compile contract to render section
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
