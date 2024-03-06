"use client"

import { Download } from "lucide-react"

import { ContractMetadata } from "@/components/main/shared/components/contract-metadata"
import { FileDownloader } from "@/lib/helpers/file-downloader"

interface AspectMetadataProps extends React.HTMLAttributes<HTMLDivElement> {
  contractWasm: Blob | undefined
}

export function AspectMetadata({
  contractWasm,
}: AspectMetadataProps) {
  const downloadWasm = () => {
    if (!contractWasm) return
    const downloader = new FileDownloader()
    downloader.downloadFile({
      source: contractWasm,
      name: "aspect.wasm",
    })
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
