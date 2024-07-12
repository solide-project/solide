import path from "path"
import { NextRequest, NextResponse } from "next/server"

import { ContractPaths, ContractDependency } from "@/lib/core"
import { filterSources, SolcError } from "@/lib/evm"
import { Solc, getSolcByVersion, removeContractHeaders } from "@/lib/server"
import { getEntryDetails } from "@/lib/server/source-loader"
import { compilerVersions, solcVersion } from "@/lib/versions"

export async function POST(request: NextRequest) {
  const version = request.nextUrl.searchParams.get("version")
  if (version && !compilerVersions.includes(version)) {
    return NextResponseError("Invalid compiler version")
  }

  const compilerVersion: string = decodeURI(version || solcVersion)
  let solcSnapshot: Solc | undefined
  try {
    solcSnapshot = await getSolcByVersion(compilerVersion)
  } catch (error) {
    console.log(error)
    return NextResponseError(`Invalid compiler version: ${compilerVersion}`)
  }

  if (!solcSnapshot) {
    return NextResponseError(`Invalid compiler version: ${compilerVersion}`)
  }

  const viaIR: boolean = request.nextUrl.searchParams.get("viaIR") === "true"
  const enabled: boolean =
    request.nextUrl.searchParams.get("optimizer") === "true"
  const runs: number =
    parseInt(request.nextUrl.searchParams.get("runs") || "-1") || -1
  const evmVersion: string | null = request.nextUrl.searchParams.get("evmVersion") || null

  let optimizer = {}
  if (enabled && runs > 0) {
    optimizer = {
      enabled,
      runs,
    }
  }

  // console.log("Compiler Version", compilerVersion)
  console.log("Using Solc Version", solcSnapshot.version())
  console.log("Run using CLI", viaIR)
  console.log("Optimizer", optimizer)

  const { input, title } = await request.json()
  const solidityInput: any = input

  // Check if the content is a (Solidity Standard Json-Input format)
  // From here we are compiling a contract
  if (solidityInput) {
    /**
     * Update the name of the contract to the first contract in the input
     * Note: We can use the etherscan api to get the contract name, but for now we will use query param for now
     */
    if (!solidityInput.sources) {
      return NextResponseError("Input sources is missing")
    }

    // We have to ensure sources are Soldility files
    solidityInput.sources = filterSources(solidityInput.sources)

    const { name } = path.parse(path.basename(title))
    // console.log("Contract Name", name)

    if (!solidityInput.language) {
      solidityInput.language = "Solidity"
    }

    if (!solidityInput.settings) {
      solidityInput.settings = {}
    }

    if (!solidityInput.settings.outputSelection) {
      solidityInput.settings.outputSelection = {
        "*": {
          "*": ["*"],
        },
      }
    }

    if (!solidityInput.settings.compilationTarget) {
      delete solidityInput.settings.compilationTarget
    }

    if (viaIR) {
      solidityInput.settings.viaIR = true
    }
    if (optimizer) {
      solidityInput.settings.optimizer = optimizer
    }

    if (evmVersion) {
      solidityInput.settings.evmVersion = evmVersion
    }

    // Since our backend doesn't have CLI and will timeout for large files, will disable for now but looking to implementation
    if (solidityInput.settings && solidityInput.settings.viaIR) {
      delete solidityInput.settings.viaIR
    }

    if (solidityInput.settings && solidityInput.settings.compilationTarget) {
      delete solidityInput.settings.compilationTarget
    }

    if (solidityInput.compiler) {
      delete solidityInput.compiler
    }

    var output = JSON.parse(solcSnapshot.compile(JSON.stringify(solidityInput)))

    if (output.errors) {
      // For demo we don't care about warnings
      output.errors = output.errors.filter(
        (error: SolcError) => error.type !== "Warning"
      )
      if (output.errors.length > 0) {
        return NextResponse.json({ details: output.errors }, { status: 400 })
      }
    }

    let dependencies: ContractDependency[] = []
    Object.keys(solidityInput.sources).forEach((contractSource) => {
      dependencies.push({
        paths: new ContractPaths(contractSource, ""),
        fileContents: removeContractHeaders(
          solidityInput.sources[contractSource].content
        ),
        originalContents: solidityInput.sources[contractSource].content,
      })
    })

    // const { flattenContract } = flattenContracts({ dependencies })
    try {
      const compiled = await getEntryDetails(output, name)
      if (compiled) {
        return NextResponse.json({ data: compiled, output: output })
      }
    } catch (error: any) {
      console.error("Error getting entry")
    }

    return NextResponse.json({ output: output })
  }
  return NextResponseError("No contract found")
}

const NextResponseError = (...messages: string[]) =>
  NextResponse.json(
    {
      details: messages.map((msg) => ({
        component: "custom",
        errorCode: "0",
        formattedMessage: msg,
        message: "Internal error while compiling.",
        severity: "error",
        sourceLocation: [],
        type: "CustomError",
      })),
    },
    { status: 400 }
  )
