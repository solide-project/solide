"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)

interface SelectedChainWarningProps
  extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
}

export function SelectedChainWarning({
  message = "Couldn't found Ethereum injection. Please install Metamask or Collect Wallet"
}: SelectedChainWarningProps) {
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger>
        <Button size="icon" variant="ghost">
          <AlertTriangle color="orange" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        {message}
      </HoverCardContent>
    </HoverCard>
  )
}
