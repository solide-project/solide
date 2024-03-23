"use client"

import path from "path"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import {
  Code,
  Download,
  File,
  FunctionSquare,
  Share2,
} from "lucide-react"

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
import { useFileSystem } from "@/components/main/file-explorer/file-provider"
import { CompileErrors } from "@/components/main/compile/errors"
import { FileTree } from "@/components/main/file-explorer/file-tree"
import { ContentLink } from "@/components/main/shared/nav/content-link"
import { SelectedChain } from "@/components/main/shared/nav/selected-chain"
import { ThemeToggle } from "@/components/theme-toggle"

import { ContractMetadata } from "../shared/components/contract-metadata"
import { IDE } from "../shared/ide"
import { IDEHeader } from "../shared/ide-header"
import { useResizables } from "../shared/use-resizeable.hook"
import { AspectEntry } from "./components/aspect-entry"
import { AspectMetadata } from "./components/aspect-metadata"
import { AspectSettings } from "./components/aspect-settings"
import { ContractBind } from "./components/bind/contract-bind"
import { DeployProperties } from "./components/deploy-properties"
import { JointsList } from "./components/joints-list"
import { useAspect } from "./provider/aspect-provider"
import { Service } from "@/lib/services/aspect/aspect-service"
import { sHelper } from "@/lib/helpers"
import { download } from "@/lib/services/file"

interface SolideAspectIDEProps extends React.HTMLAttributes<HTMLDivElement> {
  url?: string
  chainId?: string
  title?: string
  content: string
  version?: string
}

export function SolideAspectIDE({
  url,
  content,
  version,
  chainId,
  title = "Contract",
}: SolideAspectIDEProps) {
  const { aspectSDK } = useAspect()
  const {
    isFileSytemVisible,
    toggleFileSytemVisible,
    isEditorVisible,
    toggleEditorVisible,
    isContractVisible,
    toggleIsContractVisible,
  } = useResizables()
  const [isBindingVisible, setIsBindingVisible] = useState(false)
  const toggleIsBindingVisible = () => {
    setIsBindingVisible(!isBindingVisible)
  }
  const {
    fs,
    initSolIDE,
    initIDE,

    selectedFile,
    handleIDEDisplay,
  } = useFileSystem()

  const [solidityInput, setSolidityInput] = useState<CompileInput | undefined>()
  const [compiledWasm, setCompiledWasm] = useState<Blob | undefined>()

  useEffect(() => {
    (async () => {
      // At the start, we need to check if the content is JSON format
      const match = title.match(/\/([^:]+\.sol):/)
      const solFilePath = match ? match[1] : title

      handleIDEDisplay({ content, filePath: solFilePath })

      if (!content) return

      //#region Check if the smart contract is JSON format
      const input: CompileInput = sHelper.parser.compiler(content)

      if (input) {
        setSolidityInput(input)
        if (input.language === "Solidity") {
          initSolIDE(input.sources, title)
        } else {
          initIDE(input.sources, title)
        }
      } else {
        let data: CompileInput = sHelper.parser.json(content) as CompileInput
        if (!data) {
          data = {
            language: "Aspect",
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

  const setCompilingState = ({
    compiling = false,
    errors,
    contractAddress = "",
    wasm,
  }: {
    compiling?: boolean
    errors?: CompileError,
    info?: CompileResult,
    contractAddress?: string
    wasm?: Blob
  }) => {
    setCompiling(compiling)
    setCompileError(errors)
    setContractAddress(contractAddress)
    setCompiledWasm(wasm)
  }

  const compile = async () => {
    if (compiling) return

    setCompilingState({ compiling: true })

    const formData = new FormData()
    const sources = await fs.generateSources()
    const blob = new Blob([JSON.stringify({ ...solidityInput, sources })], {
      type: "text/plain",
    })

    formData.append("file", blob, title)
    const response = await fetch("/api/aspect", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const data = (await response.json()) as CompileError
      setCompilingState({ errors: data })
      return
    }

    const wasm: Blob = await response.blob()
    setCompilingState({ wasm })
  }

  const [contractAddress, setContractAddress] = useState<string>("")
  const [joints, setJoints] = useState<string[]>([])
  const [properties, setProperties] = useState<any>({} as any)

  const generateProperties = (): Service.Aspect.KVPair[] => {
    const encoder = new TextEncoder()
    const props: Service.Aspect.KVPair[] = Object.entries(properties).map(([key, val]) => ({
      key,
      value: ethers.isAddress(val as string)
        ? val
        : encoder.encode(val as string),
    }))

    return props;
  }

  const deploy = async () => {
    if (compiledWasm === undefined) return

    try {
      const props: Service.Aspect.KVPair[] = generateProperties();
      const receipt: Service.Aspect.AspectTransactionReceipt = await aspectSDK.deploy(
        compiledWasm,
        props,
        joints
      )
      setContractAddress(receipt.aspectAddress)
    } catch (error) {
      console.log(error)
    }
  }

  const upgrade = async () => {
    if (!ethers.isAddress(contractAddress)) return
    if (compiledWasm === undefined) return

    const props: Service.Aspect.KVPair[] = generateProperties();
    const receipt: Service.Aspect.AspectTransactionReceipt = await aspectSDK.upgrade(
      compiledWasm,
      props,
      joints,
      contractAddress
    )

    setContractAddress(receipt.aspectAddress)
  }

  const downloadFile = async () => {
    const sources = await fs.generateSources()
    const sourceBlob: Blob = await download(sources)
    sHelper.downloader.downloadFile({
      source: sourceBlob,
      name: "contract.zip",
    })
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

        <Button size="icon" variant="ghost" onClick={toggleIsBindingVisible}>
          <Share2 />
        </Button>

        {url && <ContentLink url={url} chainId={chainId} />}

        <Button size="icon" variant="ghost" onClick={downloadFile}>
          <Download />
        </Button>

        <div className="mt-auto flex flex-col items-center gap-2">
          <SelectedChain />
          <ThemeToggle />
          <AspectSettings />
        </div>
      </div>
      <ResizablePanelGroup direction="horizontal" className="">
        <ResizablePanel
          defaultSize={70}
          minSize={5}
          className={cn("relative", `${isEditorVisible ? "" : "hidden"}`)}
        >
          <IDEHeader />
          <IDE defaultLanguage="typescript" />
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
        {isEditorVisible && (isContractVisible || isBindingVisible) && (
          <ResizableHandle withHandle />
        )}
        <ResizablePanel defaultSize={30} minSize={5}>
          <ResizablePanelGroup direction="vertical" className="min-h-screen">
            <ResizablePanel
              defaultSize={55}
              className={cn(
                `${isContractVisible ? "" : "hidden"}`,
                `${!isEditorVisible &&
                isContractVisible &&
                "!visible !overflow-visible"
                }`
              )}
            >
              {compileError && compileError.details && (
                <CompileErrors errors={compileError.details} />
              )}
              {compiledWasm ? (
                <div className="h-full flex-col gap-2 overflow-y-auto">
                  <div className="mb-16 px-4">
                    <AspectMetadata contractWasm={compiledWasm} />
                    <div className="flex">
                      <Button
                        size="sm"
                        onClick={
                          ethers.isAddress(contractAddress)
                            ? upgrade
                            : deploy
                        }
                        variant="default"
                      >
                        {ethers.isAddress(contractAddress)
                          ? "Upgrade"
                          : "Deploy"}
                      </Button>
                      <Input
                        className="h-9 rounded-md px-3"
                        placeholder="Contract Address"
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                      />
                    </div>

                    <ContractMetadata name="Contract Tools">
                      <div className="my-2">Joints</div>
                      <JointsList setJoints={setJoints} />

                      <div className="my-2">Properties</div>
                      <DeployProperties setProperties={setProperties} />
                    </ContractMetadata>

                    <AspectEntry aspectAddress={contractAddress} />
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "flex min-h-full items-center justify-center py-4",
                    `${compileError && compileError.details && "hidden"}`
                  )}
                >
                  Compile contract to render section
                </div>
              )}
            </ResizablePanel>
            {isContractVisible && isBindingVisible && (
              <ResizableHandle withHandle />
            )}
            <ResizablePanel
              defaultSize={45}
              className={cn(
                `${isBindingVisible ? "" : "hidden"}`,
                `${!isEditorVisible &&
                isBindingVisible &&
                "!visible !overflow-visible"
                }`
              )}
            >
              <div className="h-full overflow-y-auto">
                <ContractBind
                  className="my-4 px-4"
                  aspectAddress={contractAddress}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
