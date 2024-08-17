"use client"

import * as React from "react"
import { useEffect } from "react"

import { downloadBlob, downloadJSON } from "@/lib/core"
import { CopyText } from "@/components/core/components/copy-text"

import { useEVM } from "@/components/evm/evm-provider"
import { keccak256 } from "viem"

interface ContractOverviewProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ContractOverview({ }: ContractOverviewProps) {
  const evm = useEVM()

  const [abiFunction, setAbiFunction] = React.useState<string>("")
  const [abiEvents, setAbiEvents] = React.useState<string>("")
  const [abiPayload, setABIPayload] = React.useState<string>("")

  useEffect(() => {
    if (evm.selectedCompiledContract?.abi) {
      const abi: any[] = evm.selectedCompiledContract?.abi
      const functions =
        abi.filter((a: any) => a.type === "function").length || 0
      const events = abi.filter((a: any) => a.type === "event").length || 0
      setAbiFunction(functions.toString())
      setAbiEvents(events.toString())
      setABIPayload(JSON.stringify(abi || {}))
    }
  }, [evm.selectedCompiledContract])

  const handleDownloadCompilerInput = async () => {
    const blob = await downloadJSON(evm.input)

    downloadBlob({
      source: blob,
      name: "input.json",
    })
  }

  return (
    <div className="h-full overflow-y-auto px-4">
      {evm.selectedCompiledContract?.evm?.bytecode?.opcodes && (
        <ContractOverviewItem
          data={
            <CopyText
              title="Opcode"
              payload={
                evm.selectedCompiledContract?.evm?.bytecode?.opcodes || ""
              }
            />
          }
          payload={evm.selectedCompiledContract?.evm?.bytecode?.opcodes || ""}
        />
      )}

      {evm.selectedCompiledContract?.evm?.bytecode?.object && (
        <>
          <ContractOverviewItem
            data={
              <CopyText
                title="Bytecode"
                payload={
                  evm.selectedCompiledContract?.evm?.bytecode?.object || ""
                }
              />
            }
            payload={evm.selectedCompiledContract?.evm?.bytecode?.object || ""}
          />
          <ContractOverviewItem
            data={
              <CopyText
                title="DB ID"
                payload={
                  keccak256(
                    evm.selectedCompiledContract?.evm?.bytecode?.object || ""
                  ) || ""
                }
              />
            }
            payload={
              keccak256(
                evm.selectedCompiledContract?.evm?.bytecode?.object || ""
              ) || ""
            }
          />
        </>
      )}

      {evm.selectedCompiledContract?.abi && (
        <>
          <ContractOverviewItem
            data={<CopyText title="ABI" payload={abiPayload} />}
            payload={abiPayload}
          />
          <ContractOverviewItem data="Functions" payload={abiFunction} />
          <ContractOverviewItem data="Events" payload={abiEvents} />
        </>
      )}

      {evm.input && <div onClick={handleDownloadCompilerInput}>Download</div>}
    </div>
  )
}

const ContractOverviewItem = ({
  data,
  payload,
}: {
  data: any
  payload: string
}) => {
  return (
    <div className="flex flex-col justify-between lg:flex-row">
      <div className="!font-bold">{data}</div>
      <div>{payload.length > 10 ? payload.slice(0, 25) + "..." : payload}</div>
    </div>
  )
}
