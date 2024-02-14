"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

import { AspectSDK } from "@/lib/aspect/aspect-service"
import { SolideFile } from "@/lib/client/solide-file-system"
import { solcVersion } from "@/lib/utils"

export type SolidityReleases = {
  builds: any
  releases: {
    [version: string]: string
  }
  latestRelease: string
}

export const EVMProvider = ({ children }: EVMProviderProps) => {
  const [compilerSetting, setCompilerSetting] = useState<SolideCompilerSetting>(
    new SolideCompilerSetting()
  )

  useEffect(() => {
    (async () => {
      await compilerSetting.init()
    })()
  }, [])

  return (
    <EVMContext.Provider
      value={{
        compilerSetting,
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
  compilerSetting: {} as SolideCompilerSetting,
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
