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
import { useSolideFile } from "@/components/provider/file-provider"
import { solcVersion } from "@/lib/utils"

type SolidityReleases = {
    builds: any;
    releases: {
        [version: string]: string;
    };
    latest: string;
};

function extractVersion(buildFormat: string) {
    if (!buildFormat) return buildFormat;
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
    version?: string;
}

export function SolVersion({ }: SolVersionProps) {
    const { selectedSolcVersion, setSelectedSolcVersion, loadRelease } = useSolideFile();
    const [releases, setRealeases] = useState<SolidityReleases>({
        builds: {},
        releases: {},
        latest: "",
    } as SolidityReleases);

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    useEffect(() => {
        (async () => {
            // Note: selectedSolcVersion must be set before this component is rendered somewhere
            const versions = await loadRelease();
            setRealeases(versions);
            setValue(versions.latestVersion);

            const solcVersions = versions.releases as { [key: string]: string };
            const foundVersion = Object.entries(solcVersions)
                .find(([_, build]) => build.includes(selectedSolcVersion));

            if (foundVersion) {
                setValue(foundVersion[0]); // Set the version if found
            }
        })();
    }, [])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button className="w-full">
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
                            {Object.keys(releases?.releases || {}).map((version: string, index: any) => (
                                <CommandItem
                                    key={index}
                                    value={version}
                                    onSelect={(currentValue) => {
                                        const v = extractVersion(releases.releases[currentValue])
                                        setSelectedSolcVersion(extractVersion(v))
                                        setValue(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {extractVersion(releases?.releases[version] || solcVersion)}
                                </CommandItem>
                            ))}
                        </ScrollArea>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
