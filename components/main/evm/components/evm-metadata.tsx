"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { DollarSign } from "lucide-react"

import { CopyText, CopyTextItem } from "@/components/main/shared/copy-text"

import { ContractMetadata } from "../../shared/components/contract-metadata"

interface EVMMetadataProps extends React.HTMLAttributes<HTMLDivElement> {
  contractAddress: string
  items: CopyTextItem[]
}

export function EVMMetadata({ contractAddress, items }: EVMMetadataProps) {
  const [balance, setBalance] = useState<string>("")

  const displayBalance = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const balance: BigInt = await provider.getBalance(contractAddress)
    setBalance(balance.toString())
  }
  return (
    <ContractMetadata>
      {items.map((item: CopyTextItem, index) => {
        return (
          <CopyText key={index} title={item.title} payload={item.payload} />
        )
      })}
      <div
        className="flex cursor-pointer items-center space-x-2 text-sm lg:text-base"
        onClick={displayBalance}
      >
        <div>Balance</div>
        <DollarSign className="h-3 w-3 lg:h-5 lg:w-5" />
        {balance}
      </div>
    </ContractMetadata>
  )
}
