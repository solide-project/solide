import { useState } from "react"
import { ethers } from "ethers"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useAspect } from "../provider/aspect-provider"

interface AspectEntryProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectAddress: string
}

export function AspectEntry({ aspectAddress }: AspectEntryProps) {
  const { aspectSDK } = useAspect()
  const [operatioData, setOperationData] = useState<string>("")

  const handleEntryPoint = async () => {
    const receipt = await aspectSDK.entry(aspectAddress, operatioData)
    console.log(receipt)
  }

  return (
    <div className="flex">
      <Button
        disabled={!ethers.utils.isAddress(aspectAddress) && !operatioData}
        onClick={handleEntryPoint}
      >
        Entry
      </Button>

      <Input
        onChange={(e) => setOperationData(e.target.value)}
        placeholder="Key"
      />
    </div>
  )
}
