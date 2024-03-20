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

interface SelectedEnvironmentProps extends React.HTMLAttributes<HTMLDivElement> {
    onSet: Function,
}

export enum Environment {
    METAMASK = "metamask",
    TRONLINK = "tronlink",
}

export function SelectedEnvironment({
    onSet,
}: SelectedEnvironmentProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const environments = [
        {
            id: Environment.METAMASK,
            text: "Metamask",
            disabled: false
        },
    ]
    environments.push({
        id: Environment.TRONLINK,
        text: "Tronlink",
        disabled: window.tronWeb === undefined,
    })

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value || "Metamask"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                        {environments.map(environment => {
                            return (
                                <CommandItem
                                    key={environment.id}
                                    value={environment.id}
                                    onSelect={(val: string) => {
                                        setValue(environment.text)
                                        onSet(environment.id)
                                        setOpen(false)
                                    }}
                                    className={cn(environment.disabled ? "cursor-not-allowed" : "")}
                                    disabled={environment.disabled}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === environment.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {environment.text}
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover >
    )
}
