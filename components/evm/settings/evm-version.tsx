"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  EVMVersion,
  evmVersionArray,
  useEVM,
} from "@/components/evm/evm-provider"
import { ChevronsUpDown } from "lucide-react"

interface EVMVersionsProps extends React.HTMLAttributes<HTMLDivElement> { }

export function EVMVersions({ }: EVMVersionsProps) {
  const { evmVersions, setEVMVersions } = useEVM()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<EVMVersion>(null)

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger className={buttonVariants({ variant: "ghost", size: "sm" })}>
        {evmVersions ? evmVersions : "Default"}
        <ChevronsUpDown className="w-4 h-4 ml-2" />
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search evm version..." className="h-9" />
          <CommandEmpty>No version found.</CommandEmpty>
          <ScrollArea className="max-h-[256px] overflow-y-auto">
            <CommandGroup>
              <CommandItem
                value={"default"}
                onSelect={(currentValue) => {
                  setEVMVersions(null)
                  setValue(null)
                  setOpen(false)
                }}
              >
                default
              </CommandItem>
              {evmVersionArray.map((version: EVMVersion, index: any) => (
                <CommandItem
                  className="hover:cursor-pointer"
                  key={index}
                  value={version || ""}
                  onSelect={(currentValue) => {
                    setEVMVersions(version)
                    setValue(version)
                    setOpen(false)
                  }}
                >
                  {version ? version : "Default"}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
