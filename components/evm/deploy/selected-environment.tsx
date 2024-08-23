"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Environment } from "@/lib/evm"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useEVM } from "../evm-provider"

interface SelectedEnvironmentProps
  extends React.HTMLAttributes<HTMLDivElement> { }

export function SelectedEnvironment({ }: SelectedEnvironmentProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const { environment, setEnvironment } = useEVM()

  const environments = [
    {
      id: Environment.METAMASK,
      text: "Metamask",
      disabled: false,
    },
    {
      id: Environment.TRONLINK,
      text: "Tronlink",
      disabled: window.tronWeb === undefined,
    },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between capitalize"
        >
          {environment || Environment.METAMASK}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {environments.map((environment) => {
                return (
                  <CommandItem
                    key={environment.id}
                    value={environment.id}
                    onSelect={(val: string) => {
                      setValue(environment.text)
                      setEnvironment(environment.id)
                      setOpen(false)
                    }}
                    className={cn(
                      environment.disabled ? "cursor-not-allowed" : ""
                    )}
                    disabled={environment.disabled}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value === environment.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {environment.text}
                  </CommandItem>
                )
              })}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
