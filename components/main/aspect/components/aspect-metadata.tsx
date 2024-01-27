"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CopyText, CopyTextItem } from "@/components/main/shared/copy-text"

import { ContractMetadata } from "../../shared/components/contract-metadata"

interface AspectMetadataProps extends React.HTMLAttributes<HTMLDivElement> {
  contractWasm: Blob | undefined
}

export function AspectMetadata({
  contractWasm,
  children,
}: AspectMetadataProps) {
  const downloadWasm = () => {
    if (!contractWasm) return
    const url = window.URL.createObjectURL(contractWasm)

    var link = document.createElement("a") // Or maybe get it from the current document
    link.href = url
    link.download = "aspect.wasm"
    link.click()
  }

  return (
    <ContractMetadata className=" max-h-[256px] overflow-y-auto">
      <div
        className="flex cursor-pointer items-center space-x-2 text-sm lg:text-base"
        onClick={downloadWasm}
      >
        <div>{contractWasm !== undefined ? "Download Wasm" : ""}</div>
        <Download className="h-3 w-3 lg:h-5 lg:w-5" />
      </div>
    </ContractMetadata>
  )
}
