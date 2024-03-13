import childProcess from "child_process"
import fs from "fs"
import path from "path"
import { promisify } from "util"
import { NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"

import { JSONParse } from "@/lib/utils"

const writeFileAsync = promisify(fs.writeFile)
const exec = promisify(childProcess.exec)

const TEMP_DIR = "./tmp"

export async function POST(request: NextRequest) {
  const data: FormData = await request.formData()
  const contract = data.get("file") as File
  const content: string = await contract.text()

  const { dir, base, name } = path.parse(contract.name) || "aspect.ts" // This will be the entry point of the aspect
  const solidityInput: any = JSONParse(content)

  if (!solidityInput || !solidityInput.sources) {
    return NextResponseError("Invalid contract input")
  }

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR)
  }

  // Generate unique id for compilation,
  const id = ethers.keccak256(ethers.toUtf8Bytes(content))

  const mainDir = `${TEMP_DIR}/${id}`
  const srcDir = `${mainDir}/src/${dir}`
  const outDir = `${mainDir}/target`

  const errors: any[] = []
  let output: Blob | undefined
  try {
    fs.mkdirSync(srcDir, { recursive: true })
    fs.mkdirSync(outDir, { recursive: true })

    await Promise.all(
      Object.entries(solidityInput.sources).map(async ([key, val]) => {
        if (path.extname(key) !== ".ts") {
          throw new Error("Invalid file type")
        }

        const { dir } = path.parse(key)

        const targetDir = path.join(mainDir, "src", dir)
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true })
        }

        const { content } = val as any

        // Using async writeFile to avoid callback hell
        try {
          await writeFileAsync(path.join(mainDir, "src", key), content)
        } catch (err) {
          console.error(err)
        }
      })
    )

    // Compile using Typescript and AssemblyScript
    const { stdout, stderr } = await exec(
      `npx asc ${srcDir}/${base} --outFile ${outDir}/${name}.wasm`
    )

    const buf: Buffer = await fs.readFileSync(`${outDir}/${name}.wasm`)
    output = new Blob([buf], { type: "application/wasm" })
  } catch (error: any) {
    errors.push(error.toString())
    console.error(error)
  } finally {
    fs.rmSync(mainDir, { recursive: true, force: true })
  }

  if (errors.length > 0) {
    return NextResponseError(...errors)
  }

  if (output === undefined) {
    return NextResponseError("Failed to compile")
  }

  return new NextResponse(output)
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
