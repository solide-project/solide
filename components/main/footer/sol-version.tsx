"use client"

import { useEffect, useState } from "react"
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
import { ScrollArea } from "@/components/ui/scroll-area"

type SolidityReleases = {
    builds: any;
    releases: {
        [version: string]: string;
    };
    latest: string;
};

function extractVersion(buildFormat: string) {
    const versionRegex = /soljson-(v\d+\.\d+\.\d+\+.+).js/;
    const match = buildFormat.match(versionRegex);

    if (match && match[1]) {
        return match[1];
    }
    return buildFormat;
}

function extractVersion2(version: string) {
    const versionRegex = /^v(\d+\.\d+\.\d+)/;
    const match = versionRegex.exec(version);
    return match ? match[1] : version;
}

interface SolVersionProps
    extends React.HTMLAttributes<HTMLDivElement> {
    setVersion: Function;
    version?: string;
}

export function SolVersion({ setVersion, version }: SolVersionProps) {
    const [releases, setRealeases] = useState<SolidityReleases>({
        builds: {},
        releases: {},
        latest: "",
    } as SolidityReleases);

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    useEffect(() => {
        (async () => {
            const versionResponse = await fetch("https://binaries.soliditylang.org/bin/list.json");
            const versions = await versionResponse.json();
            setRealeases(versions);
            setValue(versions.latestRelease);

            if (version) {
                setVersion(version)
                setValue(extractVersion2(version))
            }
        })();
    }, [])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between overflow-x-hidden"
                >
                    {value
                        ? extractVersion(releases.releases[value])
                        : "Select framework..."}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." className="h-9" />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                        <ScrollArea className="h-[200px]">
                            {Object.keys(releases.releases).map((version: string, index: any) => (
                                <CommandItem
                                    key={index}
                                    value={version}
                                    onSelect={(currentValue) => {
                                        setVersion(extractVersion(releases.releases[version]))
                                        setValue(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {extractVersion(releases.releases[version])}
                                </CommandItem>
                            ))}
                        </ScrollArea>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
