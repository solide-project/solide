"use client"

import { useEffect, useState } from "react"
import { ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { solcVersion } from "@/lib/versions"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLogger } from "@/components/core/providers/logger-provider"

import { SolidityReleases, useEVM } from "../evm-provider"

function extractBuild(buildFormat: string) {
  if (!buildFormat) return buildFormat
  const versionRegex = /soljson-(v\d+\.\d+\.\d+\+.+).js/
  const match = buildFormat.match(versionRegex)

  if (match && match[1]) {
    return match[1]
  }
  return buildFormat
}

function extractVersion(version: string) {
  const versionRegex = /^v(\d+\.\d+\.\d+)/
  const match = versionRegex.exec(version)
  return match ? match[1] : version
}

interface SolidityVersionsProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SolidityVersions({ }: SolidityVersionsProps) {
  const { solidityVersions, compilerVersion, setCompilerVersion } = useEVM()
  const logger = useLogger()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("0.8.23")

  useEffect(() => {
    setValue(extractVersion(compilerVersion))
    logger.info(`Compiler version: ${compilerVersion}`)
  }, [compilerVersion])

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "")}
      >
        {value ? value : "Select framework..."}
        <ChevronsUpDown className="ml-2 size-4" />
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search compiler version..." className="h-9" />
          <CommandEmpty>No version found.</CommandEmpty>
          <CommandGroup>
            <CommandList className="max-h-[256px]">
              {Object.keys(solidityVersions?.releases || {}).map(
                (version: string, index: any) => (
                  <CommandItem
                    className="hover:cursor-pointer"
                    key={index}
                    value={version}
                    onSelect={(currentValue) => {
                      const v = extractBuild(
                        solidityVersions.releases[currentValue]
                      )
                      setCompilerVersion(v)
                      setValue(currentValue)
                      setOpen(false)
                    }}
                  >
                    {extractVersion(
                      solidityVersions?.releases[version] || solcVersion
                    )}
                  </CommandItem>
                )
              )}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover >
  )
}
