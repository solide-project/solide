"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { ChainID, getNetworkNameFromChainID } from "@/lib/chains"
import { cn, solcVersion } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
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
        <ScrollArea className="h-max-[200px] my-4">
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
          <Link
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex items-center justify-center"
            )}
            href="#"
          >
            Artela Mainnet (Coming Soon)
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
