"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useEVM } from "../evm-provider"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SelectedContractProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SelectedContract({ }: SelectedContractProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const { output, setSelectedContract } = useEVM()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Select contract ..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <ScrollArea className="h-[200px]">
            <CommandGroup>
              {Object.entries(output.contracts || {}).map(
                ([targetCompilation, contract]) => {
                  return Object.entries(contract).map(
                    ([target, contractValue]) => {
                      return (
                        <CommandItem
                          key={`${targetCompilation}-${target}`}
                          value={target}
                          onSelect={(val: string) => {
                            setValue(target)
                            setSelectedContract(
                              targetCompilation,
                              target,
                              contractValue
                            )
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === target ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {target}
                        </CommandItem>
                      )
                    }
                  )
                }
              )}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
