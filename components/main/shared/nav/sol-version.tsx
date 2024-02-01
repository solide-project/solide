"use client"

import { useEffect, useState } from "react"

import { cn, solcVersion } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
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

import { SolidityReleases, useEVM } from "../../evm/provider/evm-provider"

function extractVersion(buildFormat: string) {
  if (!buildFormat) return buildFormat
  const versionRegex = /soljson-(v\d+\.\d+\.\d+\+.+).js/
  const match = buildFormat.match(versionRegex)

  if (match && match[1]) {
    return match[1]
  }
  return buildFormat
}

function extractVersion2(version: string) {
  const versionRegex = /^v(\d+\.\d+\.\d+)/
  const match = versionRegex.exec(version)
  return match ? match[1] : version
}

interface SolVersionProps extends React.HTMLAttributes<HTMLDivElement> {
  version: string
}

export function SolVersion({ version }: SolVersionProps) {
  const { compilerSetting } = useEVM()

  const [releases, setRealeases] = useState<SolidityReleases>({
    builds: {},
    releases: {},
    latestRelease: "",
  } as SolidityReleases)

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  useEffect(() => {
    (async () => {
      // Note: selectedSolcVersion must be set before this component is rendered somewhere
      setRealeases(compilerSetting.releases)
      setValue(compilerSetting.releases.latestRelease)

      // console.log(compilerSetting.compilerVersion)
      const solcVersions = compilerSetting.releases.releases as {
        [key: string]: string
      }
      const foundVersion = Object.entries(solcVersions).find(([_, build]) =>
        build.includes(version)
      )

      if (foundVersion) {
        setValue(foundVersion[0]) // Set the version if found
      }
    })()
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn(buttonVariants({ variant: "default" }))}>
        {value
          ? extractVersion(releases.releases[value])
          : "Select framework..."}
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[200px]">
              {Object.keys(releases?.releases || {}).map(
                (version: string, index: any) => (
                  <CommandItem
                    key={index}
                    value={version}
                    onSelect={(currentValue) => {
                      const v = extractVersion(releases.releases[currentValue])
                      compilerSetting.setCompilerVersion(extractVersion(v))
                      setValue(currentValue)
                      setOpen(false)
                    }}
                  >
                    {extractVersion(releases?.releases[version] || solcVersion)}
                  </CommandItem>
                )
              )}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
