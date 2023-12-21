"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { getIconByChainId } from "@/lib/chains/icon"
import { getNetworkNameFromChainID } from "@/lib/chains/name"
import Image from "next/image"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)

interface SelectedChainProps
    extends React.HTMLAttributes<HTMLDivElement> {
}

export function SelectedChain({ }: SelectedChainProps) {
    const [chainId, setChainId] = useState<number>(1);

    useEffect(() => {
        (async () => {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(hexToDecimal(chainId));

            window.ethereum.on('chainChanged', handleChainChanged);
            function handleChainChanged(chainId: any) {
                setChainId(hexToDecimal(chainId))
            }
        })();
    }, [])

    return (
        <div className="flex items-center space-x-2 text-xs md:text-sm lg:text-base">
            <div>{getNetworkNameFromChainID(chainId.toString())}</div>
            <Image width={50} height={50}
                alt={getNetworkNameFromChainID(chainId.toString())}
                src={getIconByChainId(chainId.toString())}
                className="h-5 w-5" />
        </div>
    )
}
