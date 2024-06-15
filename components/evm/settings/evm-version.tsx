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

import { EVMVersion, evmVersionArray, useEVM } from "@/components/evm/evm-provider"

interface EVMVersionsProps extends React.HTMLAttributes<HTMLDivElement> { }

export function EVMVersions({ }: EVMVersionsProps) {
    const { evmVersions, setEVMVersions } = useEVM()

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<EVMVersion>(null)

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger className={cn(buttonVariants({ variant: "default" }))}>
                {value ? value : "Default"}
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." className="h-9" />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <ScrollArea className="h-[200px]">
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
                            {evmVersionArray.map(
                                (version: EVMVersion, index: any) => (
                                    <CommandItem
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
                                )
                            )}
                        </CommandGroup>
                    </ScrollArea>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
