"use client"

import * as React from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)

interface NavItemBytecodeProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string
}

function maskString(input: string, maskChar: string = "."): string {
    if (input.length <= 8) {
        return input // If the string is 8 characters or less, return unchanged
    }

    const maskedPart = maskChar.repeat(4)
    return input.substring(0, 4) + maskedPart + input.substring(input.length - 4)
}

export function NavItemBytecode({ id }: NavItemBytecodeProps) {
    return (
        <HoverCard>
            <HoverCardTrigger>
                <Button size="icon" variant="ghost">
                    <AlertTriangle color="orange" />
                </Button>
            </HoverCardTrigger>
            <HoverCardContent>
                Contract is unverified, but there its bytecode matches one Solide&apos;s
                Open Source Database:{" "}
                <Link
                    className="text-primary hover:cursor-pointer hover:underline"
                    href={`https://gateway.btfs.io/btfs/${id}`}
                    target="_blank"
                >
                    {maskString(id)}
                </Link>
            </HoverCardContent>
        </HoverCard>
    )
}
