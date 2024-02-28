import path from "path"
import { NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"

import { isTronAddress } from "@/lib/services/explorer/scanner/tronscan"
import { isXDCAddress } from "@/lib/services/explorer/scanner/xdcscan"
import { ContractDependency, SolcError } from "@/lib/interfaces"
import {
  Solc,
  flattenContracts,
  getSolcByVersion,
  removeContractHeaders,
} from "@/lib/server"
import { getEntryDetails } from "@/lib/server/source-loader"
import { ContractPaths } from "@/lib/solide/contract-paths"
import { JSONParse, solcVersion } from "@/lib/utils"
import { compilerVersions } from "@/lib/versions"

const Module = module.constructor as any

export async function POST(request: NextRequest) {
  if (
    request.nextUrl.searchParams.get("version") &&
    !compilerVersions.includes(
      request.nextUrl.searchParams.get("version") || ""
    )
  ) {
    return NextResponseError("Invalid compiler version")
  }

  const compilerVersion: string = decodeURI(
    request.nextUrl.searchParams.get("version") || solcVersion
  )
  console.log("Compiler Version", compilerVersion)
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

  let optimizer = {}
  if (enabled && runs > 0) {
    optimizer = {
      enabled,
      runs,
    }
  }

  console.log("Using Solc Version", solcSnapshot.version())
  console.log("Run using CLI", viaIR)
  console.log("Optimizer", optimizer)

  // From here we are compiling a contract
  const data: FormData = await request.formData()
  const contract = data.get("file") as File
  const filePath: string = (data.get("source") as string) || ""
  const content: string = await contract.text()

  // Check if the content is a (Solidity Standard Json-Input format)
  const solidityInput: any = JSONParse(content)
  if (solidityInput) {
    /**
     * Update the name of the contract to the first contract in the input
     * Note: We can use the etherscan api to get the contract name, but for now we will use query param for now
     */
    if (!solidityInput.sources) {
      return NextResponseError("Input sources is missing")
    }

    // Title: the contract path
    // filePath: the source, either a github url or a contract address
    // Note we don't handle case where github url filename is a contract address
    let sourceName = path.basename(filePath) // filePath.replace(/https:\/\/raw.githubusercontent.com\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\//, "");
    let title: string = (data.get("title") as string) || ""

    // Note commiting this might break flow
    // if (
    //   !ethers.utils.isAddress(sourceName) &&
    //   !isXDCAddress(sourceName) &&
    //   !isTronAddress(sourceName)
    // ) {
    //   title = sourceName
    // }

    // get the contract name from the compilation target
    title = path.basename(title);
    // console.log("Contract Name", title)

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
    // Since our backend doesn't have CLI and will timeout for large files, will disable for now but looking to implementation
    if (solidityInput.settings && solidityInput.settings.viaIR) {
      delete solidityInput.settings.viaIR
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

    const { flattenContract } = flattenContracts({ dependencies })
    const compiled = await getEntryDetails(output, title)
    if (compiled) {
      return NextResponse.json({ data: compiled, flattenContract, output: output })
    }

    return NextResponseError("No contract found")
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
