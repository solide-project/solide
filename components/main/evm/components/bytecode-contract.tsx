"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"

import { getNetworkNameFromChainID } from "@/lib/chains"
import { Button } from "@/components/ui/button"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)

interface ByteCodeContractProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string
}

export function ByteCodeContract({
    id
}: ByteCodeContractProps) {
    return (
        <HoverCard>
            <HoverCardTrigger>
                <Button size="icon" variant="ghost">
                    <AlertTriangle color="orange" />
                </Button>
            </HoverCardTrigger>
            <HoverCardContent>
                {`Contract is unverified, but there its bytecode matches one Solide's Open Source Database: ${id}. Powered by Glacier and BFTS`}
            </HoverCardContent>
        </HoverCard>
    )
}
