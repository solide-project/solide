import { NextRequest, NextResponse } from "next/server"

import { SolidityDatabaseRegistry } from "@/lib/solidity-db/tron-contract"
import { BTFSService, GlacierService } from "@/lib/solidity-db"
import { utils } from "web3"

export async function POST(request: NextRequest) {
  const databaseService = new GlacierService()
  const storageService = new BTFSService()
  const formData: FormData = await request.formData()

  // We check if there bytecodes in our payload, no point continuing if there isn't
  const payloadData = formData.get("payload") as string
  const payload: {
    bytecodes: string[]
  } = JSON.parse(payloadData)
  if (payload.bytecodes.length === 0) {
    return NextResponse.json(
      { details: "Not Bytecode representation" },
      { status: 400 }
    )
  }

  // Upload content to BTFS
  const content = formData.get("file") as File
  const data = new Blob([content], { type: "application/json" })
  const response = await storageService.upload({
    data,
  })

  // Handle response from BTFS
  const storageUploadData = await response.json()
  if (!storageUploadData?.data?.file_hash) {
    return NextResponse.json(
      { details: "Smart contract couldn't be uploaded" },
      { status: 400 }
    )
  }
  const input = storageUploadData?.data?.file_hash

  // Store the bytecode hash in our database
  const databaseId: string[] = []
  payload.bytecodes.forEach(async (raw: string) => {
    const bytecode = utils.sha3(raw) // Hashed version of bytecode
    if (!bytecode) return
    databaseId.push(bytecode)

    // Glacier
    const exist: boolean = databaseService.exist(
      await databaseService.find(bytecode)
    )

    if (exist) {
      console.log("Bytecode already exists in database")
      return
    }
    const insert = await databaseService.insertOne({
      bytecode,
      input,
    })
  })

  try {
    // Store onchain
    const contract = new SolidityDatabaseRegistry({})
    await contract.load()
    contract.adds(databaseId, input)
  } catch (error) {
    console.log(error)
  }

  return NextResponse.json({
    id: storageUploadData?.data?.file_hash,
    databaseId,
  })
}
