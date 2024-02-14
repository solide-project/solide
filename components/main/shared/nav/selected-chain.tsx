"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { AlertTriangle } from "lucide-react"

import { getNetworkNameFromChainID } from "@/lib/chains"
import { getIconByChainId } from "@/lib/chains/src/icon"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)

interface SelectedChainProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SelectedChain({}: SelectedChainProps) {
  const [chainId, setChainId] = useState<number>(1)
  const [hasEthereumInjection, setHasEthereumInjection] =
    useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (!window || !window.ethereum) {
        // Handle non ethereum browsers (e.g. No metamask)
        return
      }

      setHasEthereumInjection(true)
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      // console.log("chainId", chainId)
      setChainId(hexToDecimal(chainId))

      window.ethereum.on("chainChanged", handleChainChanged)
      function handleChainChanged(chainId: any) {
        setChainId(hexToDecimal(chainId))
      }
    })()
  }, [])

  if (!hasEthereumInjection) {
    return (
      <HoverCard>
        <HoverCardTrigger>
          <Button size="icon" variant="ghost">
            <AlertTriangle color="orange" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          Couldn&apos;t found Ethereum injection. Please install Metamask or
          Collect Wallet
        </HoverCardContent>
      </HoverCard>
    )
  }

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Image
          width={50}
          height={50}
          alt={getNetworkNameFromChainID(chainId.toString())}
          src={getIconByChainId(chainId.toString())}
          className={cn(
            buttonVariants({ size: "icon", variant: "none" }),
            "h-5 w-5 cursor-pointer sm:h-8 sm:w-8"
          )}
        />
      </HoverCardTrigger>
      <HoverCardContent>
        {getNetworkNameFromChainID(chainId.toString()) || "Unsupported Network"}
      </HoverCardContent>
    </HoverCard>
  )
}
