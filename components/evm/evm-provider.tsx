"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

import { CompileError, DecompileOutput, Environment } from "@/lib/evm"
import { solcVersion } from "@/lib/versions"

export type SolidityReleases = {
  builds: any
  releases: {
    [version: string]: string
  }
  latestRelease: string
}

export const EVMProvider = ({ children }: EVMProviderProps) => {
  const [solidityVersions, setSolidityVersions] = useState<SolidityReleases>(
    {} as SolidityReleases
  )

  const [errors, setErrors] = useState<CompileError>({} as CompileError)
  const [output, setOutput] = useState<DecompileOutput>({} as DecompileOutput)

  const [target, setTarget] = useState<string>("")
  const [targetCompiltion, setTargetCompilation] = useState<string>("")

  const [selectedCompiledContract, setSelectedCompiledContract] = useState<any>(
    {} as any
  )

  const [compilerVersion, setCompilerVersion] = useState<string>(solcVersion)
  const [compilerOptimised, setCompilerOptimised] = useState<boolean>(false)
  const [compilerRuns, setCompilerRuns] = useState<number>(200)

  const [environment, setEnvironment] = useState<Environment>(
    Environment.METAMASK
  )

  useEffect(() => {
    ;(async () => {
      if (solidityVersions.latestRelease) {
        return
      }

      const versionResponse = await fetch(
        "https://binaries.soliditylang.org/bin/list.json"
      )
      const releases = (await versionResponse.json()) as SolidityReleases
      setSolidityVersions(releases)
    })()
  }, [])

  const resetBuild = () => {
    setOutput({} as DecompileOutput)
    setErrors({} as CompileError)
    setSelectedCompiledContract({} as any)
  }

  const setSelectedContract = (
    targetCompilation: string,
    target: string,
    info: any
  ) => {
    setTargetCompilation(targetCompilation)
    setTarget(target)
    setSelectedCompiledContract(info)
  }

  return (
    <EVMContext.Provider
      value={{
        solidityVersions,
        errors,
        setErrors,
        output,
        setOutput,
        environment,
        setEnvironment,
        target,
        targetCompiltion,
        selectedCompiledContract,
        setSelectedContract,
        compilerVersion,
        setCompilerVersion,
        compilerOptimised,
        setCompilerOptimised,
        compilerRuns,
        setCompilerRuns,
        resetBuild,
      }}
    >
      {children}
    </EVMContext.Provider>
  )
}

interface EVMProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
}

export const EVMContext = createContext({
  solidityVersions: {} as SolidityReleases,
  errors: {} as CompileError,
  setErrors: (errors: CompileError) => {},
  output: {} as DecompileOutput,
  setOutput: (output: DecompileOutput) => {},
  environment: Environment.METAMASK,
  setEnvironment: (env: Environment) => {},
  target: "",
  targetCompiltion: "",
  selectedCompiledContract: {} as any,
  setSelectedContract: (
    targetCompilation: string,
    target: string,
    info: any
  ) => {},
  compilerVersion: solcVersion,
  setCompilerVersion: (version: string) => {},
  compilerOptimised: false,
  setCompilerOptimised: (enabled: boolean) => {},
  compilerRuns: 200,
  setCompilerRuns: (runs: number) => {},
  resetBuild: () => {},
})

export const useEVM = () => useContext(EVMContext)

export class SolideCompilerSetting {
  initialised: boolean

  releases: SolidityReleases
  compilerVersion: string

  input: any

  constructor() {
    this.initialised = false
    this.releases = {
      builds: {},
      releases: {},
      latestRelease: solcVersion,
    } as SolidityReleases
    this.compilerVersion = solcVersion
    this.input = {
      language: "Solidity",
      sources: {},
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
        optimizer: {},
      },
    }
  }

  async init() {
    if (this.initialised) {
      return
    }

    this.initialised = true
    const versionResponse = await fetch(
      "https://binaries.soliditylang.org/bin/list.json"
    )
    this.releases = (await versionResponse.json()) as SolidityReleases
    this.compilerVersion = solcVersion
  }

  setCompilerVersion(version: string) {
    this.compilerVersion = version
  }

  setOptimiserEnabled(enabled: boolean, runs: number = 200) {
    if (!enabled) {
      this.input.settings.optimizer = {}
      return
    }

    this.input.settings.optimizer = {
      enabled: enabled,
      runs: runs,
    }
  }

  setOptimiserRuns(runs: number) {
    if (!this.input.settings.optimizer.enabled) {
      return
    }

    this.input.settings.optimizer.runs = runs
  }
}
