"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface ContractMetadataProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
}

export function ContractMetadata({
  name = "Metadata",
  children,
}: ContractMetadataProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="my-1 gap-2">
      <CollapsibleTrigger className="flex w-full items-center justify-between">
        <div>{name}</div>
        <div className={buttonVariants({ variant: "secondary", size: "icon" })}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="">{children}</CollapsibleContent>
    </Collapsible>
  )
}
