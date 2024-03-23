"use client"

import path from "path"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Code, Download, File, FunctionSquare } from "lucide-react"

import { CompileError, CompileInput, CompileResult } from "@/lib/interfaces"
import {
  cn,
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
import { FileTree } from "@/components/main/file-explorer/file-tree"
import { ContentLink } from "@/components/main/shared/nav/content-link"
import { SelectedChain } from "@/components/main/shared/nav/selected-chain"
import { ThemeToggle } from "@/components/theme-toggle"

import { useFileSystem } from "../file-explorer/file-provider"
import { IDE } from "../shared/ide"
import { IDEHeader } from "../shared/ide-header"
import { useResizables } from "../shared/use-resizeable.hook"
import { EVMMetadata } from "./components/evm-metadata"
import { EVMSettings } from "./components/evm-settings"
import { useEVM } from "./provider/evm-provider"
import { DecompileOutput } from "./components/selected-contract"
// import { Service } from "@/lib/services/abi/src/abi-service"
import { ByteCodeContract } from "./components/bytecode-contract"
import { sEthers } from "@/lib/services/ethers"
import { sHelper } from "@/lib/helpers"
import { sWeb3 } from "@/lib/services/web3"
import { solcVersion } from "@/lib/versions"
import { Environment, SelectedEnvironment } from "./components/selected-environment"
import { download } from "@/lib/services/file"

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
      const target = path.parse(title).name || title;
      handleIDEDisplay({ content, filePath: target })

      if (!content) return

      if (version) {
        console.log("Setting compiler version", version)
        await compilerSetting.setCompilerVersion(version)
      }

      //#region Check if the smart contract is JSON format
      const input: CompileInput = sHelper.parser.compiler(content)

      if (input) {
        setSolidityInput(input)
        if (input.language === "Solidity") {
          initSolIDE(input.sources, target)
        } else {
          initIDE(input.sources, target)
        }
      } else {
        let data: CompileInput = sHelper.parser.json(content) as CompileInput
        if (!data) {
          data = {
            language: "Solidity",
            sources: {
              [`${target}.sol`]: {
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
  const [compileError, setCompileError] = useState<CompileError | undefined>()

  const setCompilingState = ({
    compiling = false,
    errors,
    contractAddress = "",
  }: {
    compiling?: boolean
    errors?: CompileError,
    info?: CompileResult,
    contractAddress?: string
  }) => {
    setCompiling(compiling)
    setCompileError(errors)
    setContractAddress(contractAddress)
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
    const queryBuilder = new sHelper.query.QueryHelper()
    let queryString = queryBuilder.addParam('version', compileVersion);
    if (optimizer) {
      queryBuilder
        .addParam('optimizer', optimizer)
        .addParam('runs', runs.toString());
    }
    if (viaIR) {
      queryBuilder.addParam('viaIR', viaIR)
    }

    // const formData = new FormData()
    // const blob = new Blob([JSON.stringify(source)], {
    //   type: "text/plain",
    // })
    // formData.append("file", blob)
    // formData.append("title", title)
    const body = { input: source, title, }

    return fetch(`/api/compile/${queryString.build()}`, {
      method: "POST",
      // body: formData,
      body: JSON.stringify(body),
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
    // console.log(data)
    setOutput(data.output as DecompileOutput)
    handleSelectedCompiledInfo(data.data?.targetCompilation, data.data?.target, data.data?.data)
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
  const [targetCompilation, setTargetCompilation] = useState<string>("")
  const [target, setTarget] = useState<string>("")
  const [output, setOutput] = useState<DecompileOutput | null>(null)
  const [selectedCompiledInfo, setSelectedCompiledInfo] = useState<any | null>(null);
  const [contractKey, setContractKey] = useState<number>(0)
  const [environment, setEnvironment] = useState<Environment>(Environment.METAMASK)

  const setDeployState = async ({
    contractAddress = "",
    environment,
  }: {
    contractAddress: string,
    environment: Environment,
  }) => {
    setEnvironment(environment)
    setContractAddress(contractAddress)
    setContractKey(contractKey + 1)
  }

  const deploy = async () => {
    if (selectedCompiledInfo === undefined) return
    if (!window.ethereum || !window.tronWeb) return

    if (!contractAddress) {
      let parameters: any[] = constructorABI.inputs.map((input: sEthers.types.ABIParameter, index: number) => {
        const val: any = sEthers.abi
          .abiParameterToNative(input, constructorArgs[index])
        return val
      })

      if (environment === Environment.METAMASK) {
        const result = await sWeb3.evm.deploy({
          contract: selectedCompiledInfo,
          parameters,
        })

        setDeployState({
          contractAddress: result.address,
          environment: Environment.METAMASK,
        })
      } else if (environment === Environment.TRONLINK) {
        const result = await sWeb3.tron.deploy({
          contract: selectedCompiledInfo,
          parameters,
          name: target,
        })

        setDeployState({
          contractAddress: result.address,
          environment: Environment.TRONLINK,
        })
      }

      await uploadToSolidityDB();
      return
    }

    if (environment === Environment.METAMASK && ethers.isAddress(contractAddress)) {
      setDeployState({
        contractAddress: contractAddress,
        environment: Environment.METAMASK,
      })
    } else if (environment === Environment.TRONLINK && sEthers.ethers.isTronAddress(contractAddress)) {
      setDeployState({
        contractAddress: contractAddress,
        environment: Environment.TRONLINK,
      })
    }
  }

  const downloadFile = async () => {
    const sources = await fs.generateSources()
    const sourceBlob: Blob = await download(sources)
    sHelper.downloader.downloadFile({
      source: sourceBlob,
      name: "contract.zip",
    })
  }

  const uploadToSolidityDB = async () => {
    const payload: { bytecodes: string[], } = { bytecodes: [] }
    if (selectedCompiledInfo && selectedCompiledInfo?.evm?.bytecode?.object) {
      payload.bytecodes.push(selectedCompiledInfo?.evm?.bytecode?.object)
    }
    if (selectedCompiledInfo && selectedCompiledInfo?.evm?.deployedBytecode?.object) {
      payload.bytecodes.push(selectedCompiledInfo?.evm?.deployedBytecode?.object)
    }

    if (payload.bytecodes.length === 0) {
      console.log("No bytecodes to upload")
      return;  // Important uncomment this line
    }

    if (!targetCompilation || !target) {
      console.log("No target compilation")
      return;
    }

    const sources = await fs.generateSources()
    const metadata: any = {
      ...solidityInput,
      sources,
      compiler: {
        version: compilerSetting.compilerVersion,
      }
    }

    if (!metadata.settings) {
      metadata.settings = {}
    }

    metadata.settings.compilationTarget = {
      [targetCompilation]: target
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

  const handleSelectedCompiledInfo = (targetCompilation: string, target: string, info: any) => {
    setTargetCompilation(targetCompilation)
    setTarget(target)
    setSelectedCompiledInfo(info)
    const constructors: any[] = info.abi.filter(
      (m: any) => m.type === "constructor"
    )
    console.log(constructors)
    if (constructors.length > 0) {
      const contractConstructor = constructors.pop()
      setConstructorABI(contractConstructor)
    } else {
      setConstructorABI({ inputs: [] })
    }
    setContractKey(contractKey + 1)
  }

  return (
    <div className="flex max-h-screen min-h-screen">
      <div
        className={cn(
          "mx-0 max-h-screen",
          { hidden: !isFileSytemVisible }
        )}
      >
        <div className="h-full">
          <div className="h-full overflow-x-auto overflow-y-auto p-4 pb-8">
            <FileTree name={path.basename(url || "")} />
          </div>
        </div>
      </div>
      <div className="flex max-h-screen flex-col items-center gap-2 px-1 py-4 lg:px-2">
        <Button size="icon" variant="ghost" onClick={toggleFileSytemVisible}>
          <File />
        </Button>

        {/* <Button size="icon" variant="ghost" onClick={uploadToSolidityDB}>
          <Star />
        </Button> */}

        <Separator className="my-2" />

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
          className={cn("relative", { hidden: !isEditorVisible })}
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
          className={cn({ hidden: !isContractVisible })}
        >
          {compileError && compileError.details && (
            <CompileErrors errors={compileError.details} />
          )}
          {output ? (
            <div className="flex max-h-screen flex-col gap-4 overflow-y-auto px-4">
              <EVMMetadata
                contractAddress={contractAddress}
                items={[
                  {
                    title: "ABI",
                    payload: JSON.stringify(selectedCompiledInfo?.abi || "{}"),
                  },
                  {
                    title: "Bytecode",
                    payload: selectedCompiledInfo?.evm?.bytecode?.object || "",
                  },
                ]}
              />

              {/* <SelectedContract output={output} onSet={handleSelectedCompiledInfo} /> */}
              <SelectedEnvironment onSet={setEnvironment} />
              {selectedCompiledInfo &&
                <>
                  <div className="flex">
                    <Button
                      size="sm"
                      onClick={deploy}
                      variant="default"
                      disabled={
                        sEthers.ethers.isAddress(contractAddress) ||
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
                    environment={environment}
                    contractAddress={contractAddress}
                    key={contractKey}
                    abi={selectedCompiledInfo?.abi || []}
                    msgValue={msgValue}
                  />
                </>}
            </div>
          ) : (
            <div
              className={cn(
                "flex min-h-screen items-center justify-center py-4",
                { hidden: compileError && compileError.details }
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
