"use client"

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
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
import { ChainID, getIconByChainId, getNetworkNameFromChainID } from "@/lib/chains"
import { useEffect, useState } from "react"
import { ScrollArea } from "../ui/scroll-area"
import Image from "next/image"
import { useParams } from "next/navigation"

interface SelectChainProps extends React.HTMLAttributes<HTMLDivElement> {
    handleOnChange?: (value: string) => void
}

export function SelectChain({ handleOnChange }: SelectChainProps) {
    const params = useParams()

    const [open, setOpen] = useState(false)

    let chain = params.chain as string
    if (!(Object.values(ChainID) as string[]).includes(chain)) {
        chain = ChainID.ETHEREUM_MAINNET
    }

    const [value, setValue] = useState<string>(chain)

    const chainList = Object.entries(ChainID).map(([_, value]) => ({
        value: value.toString(),
        label: getNetworkNameFromChainID(value),
    }))

    useEffect(() => {
        handleOnChange && handleOnChange(value)
    }, [value])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <Image
                        width={50}
                        height={50}
                        alt={getNetworkNameFromChainID(value)}
                        loader={() => getIconByChainId(value)}
                        src={getIconByChainId(value)}
                        // src={getIconByChainId(chainId.toString())}
                        className={cn(
                            buttonVariants({ size: "icon", variant: "outline" }),
                            "h-5 w-5 cursor-pointer border-none sm:h-8 sm:w-8"
                        )}
                    />
                    {value &&
                        getNetworkNameFromChainID(value)}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 border-none">
                <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                        <ScrollArea className="h-[200px] 1-full">
                            {(chainList).map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={getNetworkNameFromChainID(framework.value)}
                                    onSelect={(currentValue) => {
                                        setValue(framework.value)
                                        handleOnChange && handleOnChange(framework.value)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === framework.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {framework.label}
                                </CommandItem>
                            ))}
                        </ScrollArea>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}