"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { ChainID, getNetworkNameFromChainID } from "@/lib/chains"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LoadEVMContractProps extends React.HTMLAttributes<HTMLDivElement> {
  contractAddress: string
}

export function LoadEVMContract({ contractAddress }: LoadEVMContractProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const chains = [ChainID.ARTELA_TESTNET]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(buttonVariants({ variant: "default", size: "sm" }))}
      >
        {value ? getNetworkNameFromChainID(value) : "Load to IDE"}
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <div className="text-center py-2">
          Mainnet (Coming soon)
        </div>
        <ScrollArea className="h-max-[200px]">
          {chains.map((chain: string, index: any) => (
            <Link
              key={index}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "flex items-center justify-center"
              )}
              href={`address/${chain}/${contractAddress}`}
              target="_blank"
            >
              {getNetworkNameFromChainID(chain)}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
