"use client"

import path from "path"
import { useEffect, useState } from "react"
import Editor from "@monaco-editor/react"
import { Signer, ethers } from "ethers"
import { Code, Download, File, FunctionSquare, Settings } from "lucide-react"
import { useTheme } from "next-themes"

import { CompileError, CompileResult } from "@/lib/interfaces"
import {
  GetSolidityJsonInputFormat,
  JSONParse,
  cn,
  solcVersion,
} from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { CompileErrors } from "@/components/main/compile/errors"
import { EditorLoading } from "@/components/main/compile/loading"
import { ContractInvoke } from "@/components/main/evm/components/contract-invoke"
import { FileTree } from "@/components/main/file-tree"
import { ContractMetadata } from "@/components/main/shared/components/contract-metadata"
import { ContentLink } from "@/components/main/shared/nav/content-link"
import { SelectedChain } from "@/components/main/shared/nav/selected-chain"
import { SolVersion } from "@/components/main/shared/nav/sol-version"
import { ThemeToggle } from "@/components/theme-toggle"

import { useFileSystem } from "../../file-provider"
import { IDE } from "../shared/ide"
import { IDEHeader } from "../shared/ide-header"
import { useResizables } from "../shared/use-resizeable.hook"
import { EVMMetadata } from "./components/evm-metadata"
import { EVMSettings } from "./components/evm-settings"
import { useEVM } from "./provider/evm-provider"
import { DecompileOutput, SelectedContract } from "./components/selected-contract"

interface SolideIDEProps extends React.HTMLAttributes<HTMLDivElement> {
  url?: string
  chainId?: string
  title?: string
  content: string
  version?: string
}

interface CompileInput {
  language: "Solidity" | "Yul" | "LLL" | "Assembly" | "Vyper"
  settings?: {
    outputSelection: any
    optimizer: any
    evmVersion: string
    metadata: any
    libraries: any
    remappings: any
    metadataHash: string
  }
  sources: {
    [key: string]: CompileSource
  }
}

export interface CompileSource {
  content: string
}

export function SolideIDE({
  url,
  content,
  version,
  chainId,
  title = "Contract",
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

  const [compileInfo, setCompileInfo] = useState<CompileResult | undefined>()
  const [solidityInput, setSolidityInput] = useState<CompileInput | undefined>()

  useEffect(() => {
    (async () => {
      // At the start, we need to check if the content is JSON format
      const match = title.match(/\/([^:]+\.sol):/)
      const solFilePath = match ? match[1] : title

      handleIDEDisplay({ content, filePath: solFilePath })

      if (!content) return

      if (version) {
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
  const [compileError, setCompileError] = useState<CompileError | undefined>()

  const compile = async () => {
    if (compiling) return

    setCompiling(true)
    setCompileError(undefined)
    setCompileInfo(undefined)
    setContract(undefined)

    const formData = new FormData()

    // override the content with the json format if it exists
    const sources = await fs.generateSources()
    const blob = new Blob([JSON.stringify({ ...solidityInput, sources })], {
      type: "text/plain",
    })
    formData.append("file", blob, url)

    formData.append("source", url || encodeURIComponent(title))

    if (title) {
      formData.append("title", title)
    }

    let uri = `/api/compile?version=${encodeURIComponent(
      compilerSetting.compilerVersion
    )}`

    if (compilerSetting.input?.settings?.optimizer?.enabled) {
      uri += `&optimizer=${encodeURIComponent(
        compilerSetting.input.settings.optimizer.enabled
      )}&runs=${encodeURIComponent(
        compilerSetting.input?.settings?.optimizer?.runs || 200
      )}`
    }

    if (compilerSetting.input?.settings?.optimizer?.viaIR) {
      uri += `&viaIR=${encodeURIComponent(
        compilerSetting.input.optimizer.viaIR
      )}`
    }

    const response = await fetch(uri, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const data = (await response.json()) as CompileError
      setCompileError(data)
      setCompiling(false)
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
    setContractAddress("")
    setCompileInfo(data)
    setCompiling(false)
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
  const deploy = async () => {
    console.log(selectedCompiledInfo)

    if (compileInfo === undefined) return

    setContract(undefined)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner() as Signer

    // console.log(
    //   constructorArgs,
    //   constructorABI,
    //   constructorArgs.length,
    //   (constructorABI.inputs || []).length
    // )
    if (!ethers.utils.isAddress(contractAddress)) {
      const factory = new ethers.ContractFactory(
        compileInfo.data.abi,
        compileInfo.data.evm.bytecode.object,
        signer
      )
      const contract = await factory.deploy(...constructorArgs)
      setContractAddress(contract.address)
      setContractKey(contractKey + 1)
      setContract(contract)
    } else {
      const contract = new ethers.Contract(
        contractAddress,
        compileInfo.data.abi,
        signer
      )
      setContractAddress(contract.address)
      setContractKey(contractKey + 1)
      setContract(contract)
    }
  }

  const downloadFile = async () => {
    const sourceBlob: Blob = await fs.download()
    const link = document.createElement('a');
    link.href = URL.createObjectURL(sourceBlob);
    link.download = 'source.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                    ethers.utils.isAddress(contractAddress) ||
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
