"use client"

import { SolideFile, isSolideFile } from "@/lib/solide/solide-file";
import { solcVersion } from "@/lib/utils";
import React, { createContext, useContext, useEffect, useState } from "react";

export const SolideFileProvider = ({ children }: SolideFileProviderProps) => {
    const [input, setInput] = useState<any>({
        language: "Solidity",
        sources: {},
        settings: {
            // remappings: [ ":g=/dir" ],
            outputSelection: {
                "*": {
                    "*": ["*"]
                }
            },
        }
    });

    const [releases, setReleases] = useState<any | null>(null);
    const [selectedSolcVersion, setSelectedSolcVersion] = useState<string>(solcVersion);
    const [folder, setFolder] = useState<any>({});
    const [ideKey, setIDEKey] = useState<number>(1);

    const [selectedFile, setSelectedFile] = useState<SolideFile>({} as SolideFile);

    const loadRelease = async () => {
        if (releases) {
            return releases;
        }
        const versionResponse = await fetch("https://binaries.soliditylang.org/bin/list.json");
        const versions = await versionResponse.json();
        setReleases(versions);
        return versions;
    }

    const handleIDEDisplay = (file: SolideFile) => {
        // TODO: Prevent re-rendering if content is the same
        setIDEKey(ideKey + 1);
        setSelectedFile(file);
    }

    const handleIDEChange = (folderPath: string, content: string) => {
        const paths = folderPath.split('/');

        let currentLocation = { ...folder };

        for (const folder of paths.slice(0, -1)) {
            if (!currentLocation[folder]) {
                currentLocation[folder] = {};
            }
            currentLocation = currentLocation[folder];
        }

        currentLocation[paths[paths.length - 1]] = {
            content: content,
            filePath: folderPath,
        } as SolideFile;

        setSelectedFile((prevFile: SolideFile) => ({ ...prevFile, content }));
        setFolder((prevFolder: any) => ({ ...prevFolder, ...currentLocation }))
    }

    return (
        <SolideFileContext.Provider value={{
            folder, setFolder, handleIDEChange,
            ideKey, selectedFile, handleIDEDisplay,
            releases, loadRelease,
            selectedSolcVersion, setSelectedSolcVersion
        }}>
            {children}
        </SolideFileContext.Provider>
    )
}


interface SolideFileProviderProps extends
    React.HTMLAttributes<HTMLDivElement> {
    name?: string;
}

export const SolideFileContext = createContext({
    folder: {},
    ideKey: 1,
    selectedFile: {} as SolideFile,
    handleIDEDisplay: (display: SolideFile) => { },
    setFolder: (folder: any) => { },
    handleIDEChange: (folderPath: string, content: string) => { },
    releases: {} as any,
    loadRelease: () => { return {} as any },
    selectedSolcVersion: solcVersion,
    setSelectedSolcVersion: (version: string) => { },
});

export const useSolideFile = () => useContext(SolideFileContext);