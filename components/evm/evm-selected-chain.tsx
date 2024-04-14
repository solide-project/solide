"use client"

import * as React from "react"
import { useEffect, useState } from "react"

import { getIconByChainId, getNetworkNameFromChainID } from "@/lib/chains"

import { SelectedChain } from "@/components/core/components/selected-chain"
import { EVMSelectedChainWarning } from "@/components/core/components/selected-chain-warning"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)

interface EVMSelectedChainProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EVMSelectedChain({}: EVMSelectedChainProps) {
  const [chainId, setChainId] = useState<number>(1)
  const [hasEthereumInjection, setHasEthereumInjection] =
    useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (!window || !window.ethereum) {
        return
      }

      setHasEthereumInjection(true)
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      setChainId(hexToDecimal(chainId))

      // console.log("chainId", chainId)
      window.ethereum.on("chainChanged", handleChainChanged)
      function handleChainChanged(chainId: any) {
        setChainId(hexToDecimal(chainId))
      }
    })()
  }, [])

  if (!hasEthereumInjection) {
    return <EVMSelectedChainWarning />
  }

  return (
    <SelectedChain
      name={getNetworkNameFromChainID(chainId.toString())}
      src={getIconByChainId(chainId.toString())}
    />
  )
}
