"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ethers } from "ethers"
import { Box, Github } from "lucide-react"

import { ChainID, getExplorer } from "@/lib/chains"
import { isTronAddress } from "@/lib/services/explorer/scanner/tronscan"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface ContentLinkProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  chainId?: string
}
export function ContentLink({
  url,
  chainId = ChainID.ETHEREUM_MAINNET,
}: ContentLinkProps) {
  const [explorerPath, setExplorerPath] = useState<string>("")

  useEffect(() => {
    const updateExplorerPath = () => {
      if (ethers.isAddress(url) || isTronAddress(url)) {
        const explorer = getExplorer(chainId)
        let addressPath = ""

        switch (chainId) {
          case ChainID.TRON_MAINNET:
          case ChainID.TRON_SHASTA_TESTNET:
            addressPath = `contract/${url}`
          case ChainID.PALM_MAINNET:
          case ChainID.PALM_TESTNET:
            addressPath = `contracts/${url}`
            break
          default:
            addressPath = `address/${url}`
            break
        }

        setExplorerPath(`${explorer}/${addressPath}`)
      }
    }

    updateExplorerPath()
  }, [url, chainId])

  return (
    <Link
      href={!ethers.isAddress(url) ? url : explorerPath}
      target="_blank"
      className={cn(
        buttonVariants({ size: "icon", variant: "ghost" }),
        "cursor-pointer border-0"
      )}
    >
      {!ethers.isAddress(url) ? (
        <Github />
      ) : (
        <Box />
      )}
    </Link>
  )
}
