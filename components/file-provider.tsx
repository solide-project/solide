"use client"

import path from "path"
import React, { createContext, useContext, useState } from "react"

import { SolideFile, SolideFileSystem } from "@/lib/client/solide-file-system"
import { CompileSource } from "@/lib/interfaces"

/**
 * VFS Provider to handle files and folders in the IDE
 */
export const FileSystemProvider = ({ children }: FileSystemProviderProps) => {
  const [fs, setFS] = useState<SolideFileSystem>({} as SolideFileSystem)
  const [selectedFile, setSelectedFile] = useState<SolideFile>({} as SolideFile)

  //#region IDE control methods
  const handleIDEDisplay = (file: SolideFile) => {
    setSelectedFile(file)
  }

  const handleIDEChange = (filePath: string, content: string) => {
    if (fs) {
      fs?.updateFile(filePath, content)
      setSelectedFile((prevFile: SolideFile) => ({ ...prevFile, content }))
    }
  }
  //#endregion

  //#region init IDE methods
  const initFS = async (sources: { [key: string]: CompileSource }) => {
    const fs = new SolideFileSystem()
    await fs.init(sources)
    setFS(fs)
  }

  const initEntryIDE = async (
    onChainEntry: [string, CompileSource] | undefined
  ) => {
    if (onChainEntry) {
      const [key, onChainContent] = onChainEntry
      // Now, key is the key, and onChainContent is the value
      handleIDEDisplay({
        content: onChainContent.content,
        filePath: key,
      })
    }
  }

  const initSolIDE = async (
    sources: { [key: string]: CompileSource },
    entry: string
  ) => {
    await initFS(sources)

    const parsedPath = path.parse(entry)
    const onChainEntry = Object.entries(sources).find(([_, val]) =>
      val.content.includes(`contract ${parsedPath.name || entry}`)
    )

    initEntryIDE(onChainEntry)
  }

  const initIDE = async (
    sources: { [key: string]: CompileSource },
    entry: string
  ) => {
    await initFS(sources)

    const onChainEntry = Object.entries(sources).find(([key, _]) =>
      path.basename(key).startsWith(path.basename(entry))
    )

    initEntryIDE(onChainEntry)
  }
  //#endregion

  return (
    <FileContext.Provider
      value={{
        fs,
        initSolIDE,
        initIDE,

        selectedFile,
        handleIDEChange,
        handleIDEDisplay,
      }}
    >
      {children}
    </FileContext.Provider>
  )
}

interface FileSystemProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
}

export const FileContext = createContext({
  fs: {} as SolideFileSystem,
  initSolIDE: async (sources: any, entry: string) => {},
  initIDE: async (sources: any, entry: string) => {},

  selectedFile: {} as SolideFile,
  handleIDEDisplay: (display: SolideFile) => {},
  handleIDEChange: (folderPath: string, content: string) => {},
})

export const useFileSystem = () => useContext(FileContext)
