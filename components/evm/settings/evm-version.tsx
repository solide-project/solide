"use client"

import { useState } from "react"
import { ChevronsUpDown } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
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
import {
  EVMVersion,
  evmVersionArray,
  useEVM,
} from "@/components/evm/evm-provider"

interface EVMVersionsProps extends React.HTMLAttributes<HTMLDivElement> { }

export function EVMVersions({ }: EVMVersionsProps) {
  const { evmVersions, setEVMVersions } = useEVM()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<EVMVersion>(null)

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        {evmVersions ? evmVersions : "Default"}
        <ChevronsUpDown className="ml-2 size-4" />
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search evm version..." className="h-9" />
          <CommandEmpty>No version found.</CommandEmpty>
          <CommandGroup>
            <CommandList
              className="max-h-[256px]"
            >
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
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
