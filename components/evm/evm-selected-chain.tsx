"use client"

import * as React from "react"
import { useEffect, useState } from "react"

import {
  ChainID,
  getIconByChainId,
  getNetworkNameFromChainID,
} from "@/lib/chains"
import { Environment } from "@/lib/evm"
import { SelectedChain } from "@/components/core/components/selected-chain"
import { EVMSelectedChainWarning } from "@/components/core/components/selected-chain-warning"

import { useEVM } from "./evm-provider"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)
export const hexToString = (hex: string): string => hexToDecimal(hex).toString()
export const getTronNetwork = (rpc: string) => {
  if (rpc.includes("shasta")) return ChainID.TRON_SHASTA_TESTNET
  if (rpc.includes("nile")) return ChainID.TRON_NILE_TESTNET
  if (rpc.includes("grid")) return ChainID.TRON_MAINNET

  return ChainID.TRON_MAINNET
}

interface EVMSelectedChainProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EVMSelectedChain({}: EVMSelectedChainProps) {
  const evm = useEVM()
  const [chainId, setChainId] = useState<string>("1")
  const [hasEthereumInjection, setHasEthereumInjection] =
    useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (!window || !window.ethereum) {
        return
      }

      setHasEthereumInjection(true)
      if (
        evm.environment === Environment.TRONLINK &&
        window.tronWeb?.fullNode?.host
      ) {
        console.log(window.tronWeb.fullNode.host)
        setChainId(getTronNetwork(window.tronWeb.fullNode.host))
        return
      }

      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      setChainId(hexToString(chainId))

      // console.log("chainId", chainId)
      window.ethereum.on("chainChanged", handleChainChanged)
      function handleChainChanged(chainId: any) {
        setChainId(hexToString(chainId).toString())
      }
    })()
  }, [evm.environment])

  if (!hasEthereumInjection) {
    return <EVMSelectedChainWarning />
  }

  return (
    <SelectedChain
      name={getNetworkNameFromChainID(chainId)}
      src={getIconByChainId(chainId)}
    />
  )
}
