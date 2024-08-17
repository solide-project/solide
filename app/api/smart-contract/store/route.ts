import { NextRequest, NextResponse } from "next/server"
import { keccak256, toHex } from "viem"

import { BTFSService, GlacierService } from "@/lib/solidity-db"
import { SolidityDatabaseRegistry } from "@/lib/solidity-db/tron-contract"

export async function POST(request: NextRequest) {
  const databaseService = new GlacierService()
  const storageService = new BTFSService()
  const contract = new SolidityDatabaseRegistry({})
  await contract.load()

  // Check if the contract has enough resources to store the contract
  const sufficient = await contract.hasSufficientResource()
  if (!sufficient)
    return generateError(
      `Not enough resources to store contract. You can help out by staking on ${contract.account}`
    )

  // We check if there bytecodes in our payload, no point continuing if there isn't
  const formData: FormData = await request.formData()
  const payloadData = formData.get("payload") as string
  const payload: { bytecodes: string[] } = JSON.parse(payloadData)
  if (payload.bytecodes.length === 0)
    return generateError("Not Bytecode representation")

  // Upload content to BTFS
  const content = formData.get("file") as File
  const data = new Blob([content], { type: "application/json" })
  const response = await storageService.upload({
    data,
  })

  // Handle response from BTFS
  const storageUploadData = await response.json()
  const contractCid: string = storageUploadData?.data?.file_hash || ""
  if (!contractCid) return generateError("Smart contract couldn't be uploaded")

  // Store the bytecode hash in our database
  const databaseId: string[] = []
  for (const raw of payload.bytecodes) {
    const bytecode = keccak256(toHex(raw)) // Hashed version of bytecode
    if (!bytecode) continue

    // Glacier
    // const exist: boolean = databaseService.exist(
    //   await databaseService.find(bytecode)
    // )

    const results = await contract.find(bytecode)
    if (results && results?.id) {
      console.log("Bytecode already exists in database")
      continue
    }

    databaseId.push(bytecode)
    const insert = await databaseService.insertOne({
      bytecode,
      input: contractCid,
    })
  }

  try {
    // Store onchain
    if (databaseId && databaseId.length > 0) {
      // Adding multiple
      // console.log("Adding to contract", databaseId, input)
      // contract.adds(databaseId, input)

      const bytecodeId = databaseId[0]
      if (bytecodeId) {
        console.log("Adding to contract", bytecodeId, contractCid)
        contract.addOverride(bytecodeId, contractCid)
      }
    }
  } catch (error) {
    console.log(error)
  }

  return NextResponse.json({
    id: contractCid,
    databaseId,
  })
}

const generateError = (message: string, status: number = 400) => {
  return NextResponse.json({ message }, { status })
}
