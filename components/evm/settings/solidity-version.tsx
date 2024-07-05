"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { solcVersion } from "@/lib/versions"
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
      <PopoverTrigger className={cn(buttonVariants({ variant: "default" }), "!text-base")}>
        {value && solidityVersions.releases
          ? extractVersion(
            solidityVersions.releases[value] || "Unknown version"
          )
          : "Select framework..."}
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandEmpty>No framework found.</CommandEmpty>
          <ScrollArea className="h-[200px]">
            <CommandGroup>
              {Object.keys(solidityVersions?.releases || {}).map(
                (version: string, index: any) => (
                  <CommandItem
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
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
