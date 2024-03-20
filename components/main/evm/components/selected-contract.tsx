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

export interface DecompileOutput {
    contracts: {
        [key: string]: {
            [key: string]: DecompileSource
        }
    },
    errors: any[],
    sources: any,
}

export interface DecompileSource {
    abi: any[];
    devdoc: {
        details: string;
        kind: string;
        methods: Record<string, any>;
        version: number;
    };
    evm: {
        bytecode: {
            functionDebugData: Record<string, any>;
            generatedSources: any[];
            linkReferences: Record<string, any>;
            object: string;
            opcodes: string;
            sourceMap: string;
        };
        deployedBytecode: {
            functionDebugData: Record<string, any>;
            generatedSources: any[];
            immutableReferences: Record<string, any>;
            linkReferences: Record<string, any>;
            object: string;
            opcodes: string;
            sourceMap: string;
        };
    };
    metadata: string;
    settings: {
        compilationTarget: Record<string, string>;
        evmVersion: string;
        libraries: Record<string, any>;
        metadata: {
            bytecodeHash: string;
        };
        optimizer: {
            enabled: boolean;
            runs: number;
        };
        remappings: any[];
    };
    sources: Record<string, {
        keccak256: string;
        license: string;
        urls: string[];
    }>;
    version: number;
    userdoc: {
        kind: string;
        methods: Record<string, any>;
        version: number;
    };
}

interface SelectedContractProps extends React.HTMLAttributes<HTMLDivElement> {
    output: DecompileOutput,
    onSet: Function,
}

export function SelectedContract({
    output,
    onSet,
}: SelectedContractProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

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
                    <CommandGroup>
                        {Object.entries(output.contracts).map(([targetCompilation, contract]) => {
                            return Object.entries(contract).map(([target, contractValue]) => {
                                return (
                                    <CommandItem
                                        key={`${targetCompilation}-${target}`
                                        }
                                        value={target}
                                        onSelect={(val: string) => {
                                            setValue(target)
                                            onSet(targetCompilation, target, contractValue)
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
                                );
                            });
                        })}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover >
    )
}
