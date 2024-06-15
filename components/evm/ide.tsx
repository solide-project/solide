"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ConsoleLogger } from "@/components/core/console"
import { FileTree } from "@/components/core/file-tree"
import { IDE } from "@/components/core/ide"
import { IDEHeader } from "@/components/core/ide-header"
import { useEditor } from "@/components/core/providers/editor-provider"
import { useFileSystem } from "@/components/core/providers/file-provider"
import { useLogger } from "@/components/core/providers/logger-provider"
import {
  CODE_KEY,
  CONSOLE_KEY,
  EDITOR_KEY,
  FILE_KEY,
  useNav,
} from "@/components/core/providers/navbar-provider"
import { BuildDeploy } from "@/components/evm/deploy/build-deploy"
import { useEVM } from "@/components/evm/evm-provider"
import { EVMNavBar } from "@/components/evm/navbar/navbar"
import { QueryHelper } from "@/lib/core"
import { CompileError, CompileInput, isAddress, parseInput } from "@/lib/evm"
import { getContractExplorer } from "@/lib/chains"
import { UTILITY_KEY } from "@/components/evm/navbar/nav-item-utility"
import { UtiltyTab } from "@/components/evm/utils/utility-tab"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)

interface EvmIDEProps extends React.HTMLAttributes<HTMLDivElement> {
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

export function EvmIDE({
  url,
  chainId,
  title,
  content,
  version,
  bytecodeId,
}: EvmIDEProps) {
  const [input, setInput] = React.useState<any>({})

  const fs = useFileSystem()
  const ide = useEditor()
  const logger = useLogger()
  const evm = useEVM()

  const { setNavItemActive, isNavItemActive } = useNav()

  React.useEffect(() => {
    ; (async () => {
      if (version) {
        evm.setCompilerVersion(version)
      }

      setNavItemActive(EDITOR_KEY, true)
      setNavItemActive(FILE_KEY, true)
      setNavItemActive(CONSOLE_KEY, true)

      let input: CompileInput = parseInput(content)
      if (!input) {
        // This means is single file
        input = {
          language: "Solidity",
          sources: {
            [`${title}.sol`]: {
              content: content,
            },
          },
        }
      }
      setInput(input)
      const entryFile = await fs.initAndFoundEntry(input.sources, title || "")
      if (entryFile) {
        ide.selectFile(entryFile)
      }

      logger.info("Welcome to Solide IDE")
    })()
  }, [])

  const [compiling, setCompiling] = React.useState<boolean>(false)
  const handleCompile = async () => {
    const start = performance.now()
    logger.info("Compiling ...")
    setCompiling(true)

    try {
      await doCompile()
    } catch (error: any) {
      logger.error(error)
    }

    const end = performance.now()
    logger.success(`Compiled in ${end - start} ms.`, true)
    setCompiling(false)

    setNavItemActive(CODE_KEY, true)
  }

  const doCompile = async () => {
    evm.resetBuild()
    const queryBuilder = new QueryHelper()
    let queryString = queryBuilder.addParam("version", evm.compilerVersion)

    if (evm.compilerOptimised) {
      queryBuilder
        .addParam("optimizer", evm.compilerOptimised)
        .addParam("runs", evm.compilerRuns.toString())
    }

    if (evm.evmVersions) {
      queryBuilder
        .addParam("evm", evm.evmVersions)
    }
    // if (viaIR) {
    //     queryBuilder.addParam('viaIR', viaIR)
    // }

    // const formData = new FormData()
    // const blob = new Blob([JSON.stringify(source)], {
    //   type: "text/plain",
    // })
    // formData.append("file", blob)
    // formData.append("title", title)
    const sources = fs.generateSources()
    const source: any = { ...input, sources }
    //#region Clean up input
    if (source.abi) {
      delete source.abi
    }
    //#endregion
    const body = { input: source, title }

    const response = await fetch(`/api/compile/${queryString.build()}`, {
      method: "POST",
      // body: formData,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const data = (await response.json()) as CompileError
      evm.setErrors(data)

      logger.error(`Compiled with ${data.details.length} errors.`, true)
      // setCompilingState({ errors: data, })
      return
    }

    evm.setInput({
      language: "Solidity",
      sources: sources,
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
    })

    const data = await response.json()
    evm.setSelectedContract(
      data.data?.targetCompilation,
      data.data?.target,
      data.data?.data
    )
    evm.setOutput(data.output)
  }

  const generateURL = () => {
    if (chainId && isAddress(url || "")) {
      return getContractExplorer(chainId, url || "")
    }
    return url || ""
  }

  return (
    <div className="min-w-screen max-w-screen flex max-h-screen min-h-screen">
      <div className="py-2 pl-2">
        <EVMNavBar url={generateURL()} bytecodeId={bytecodeId} />
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-w-screen max-w-screen max-h-screen min-h-screen"
      >
        <ResizablePanel
          defaultSize={30}
          minSize={25}
          className={cn({
            hidden: !(isNavItemActive(FILE_KEY) || isNavItemActive(CODE_KEY)),
          })}
        >
          <div className="flex max-h-screen w-full flex-col gap-y-2 overflow-y-auto p-2">
            {isNavItemActive(FILE_KEY) && (
              <FileTree className="rounded-lg bg-grayscale-025 pb-4" />
            )}
            {isNavItemActive(CODE_KEY) && (
              <BuildDeploy className="rounded-lg bg-grayscale-025" />
            )}
            {isNavItemActive(UTILITY_KEY) && (
              <UtiltyTab className="rounded-lg bg-grayscale-025" />
            )}
          </div>
        </ResizablePanel>
        {(isNavItemActive(FILE_KEY) || isNavItemActive(CODE_KEY)) && (
          <ResizableHandle withHandle />
        )}
        <ResizablePanel defaultSize={70} minSize={5}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel
              defaultSize={75}
              minSize={5}
              className={cn("relative", {
                hidden: !isNavItemActive(EDITOR_KEY),
              })}
            >
              {isNavItemActive(EDITOR_KEY) && (
                <>
                  <IDEHeader />
                  <IDE />
                  <Button
                    className="absolute"
                    style={{ bottom: "16px", right: "16px" }}
                    size="sm"
                    onClick={handleCompile}
                    disabled={compiling}
                  >
                    {compiling ? "Compiling ..." : "Compile"}
                  </Button>
                </>
              )}
            </ResizablePanel>
            {isNavItemActive(EDITOR_KEY) && isNavItemActive(CONSOLE_KEY) && (
              <ResizableHandle withHandle />
            )}
            <ResizablePanel
              defaultSize={25}
              minSize={5}
              className={cn(
                "m-2 !overflow-y-auto rounded-lg bg-grayscale-025",
                { hidden: !isNavItemActive(CONSOLE_KEY) }
              )}
            >
              <ConsoleLogger className="p-3" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
