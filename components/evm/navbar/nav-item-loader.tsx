"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { isAddress } from "viem"
import { Braces } from "lucide-react"

import { ChainID } from "@/lib/chains"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SelectChain } from "@/components/evm/select-chain"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { NavItemTheme } from "@/components/core/navbar/nav-item-theme"
import Image from "next/image"


interface NavItemLoaderProps extends React.HTMLAttributes<HTMLButtonElement> {
    message?: string
    forceOpen?: boolean
}

export function NavItemLoader({ message, forceOpen = false }: NavItemLoaderProps) {
    const { push } = useRouter()

    const [selectedChain, setSelectedChain] = useState<string>(ChainID.ETHEREUM_MAINNET)
    const [searchResult, setSearchResult] = useState<string>("")
    // const [githubContract, setGithubContract] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>("")

    const handleChainChange = (chainId: string) => {
        setSelectedChain(chainId)
    }

    const handleLoadContract = (e: React.FormEvent) => {
        e.preventDefault()

        if (searchResult.startsWith("https://github.com/") && searchResult.endsWith(".sol")) {
            push(`/?url=${searchResult}`)
        } else if (isAddress(searchResult)) {
            push(`/address/${selectedChain}/${searchResult}`)
        } else {
            setErrorMessage("Invalid contract address or github url")
        }
    }

    return <Drawer
        open={forceOpen ? true : undefined}
        dismissible={forceOpen ? false : true}>
        {!forceOpen && <DrawerTrigger asChild>
            <Button className="cursor-pointer border-0 hover:bg-grayscale-100"
                size="icon" variant="ghost">
                <Braces />
            </Button>
        </DrawerTrigger>}
        <DrawerContent className="h-[95vh] bg-none">
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
            <form className="my-2" onSubmit={handleLoadContract}>
                <div className="flex flex-col gap-4 items-center justify-center">
                    <Image src="solide-dark.svg" alt="logo" height={64} width={64} />
                    <div className="text-center font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold my-2">
                        Solide
                    </div>
                </div>
                {(errorMessage || message) &&
                    <div className="my-2 text-center text-red-500">{errorMessage || message}</div>}

                <div className="flex items-center justify-center">
                    <div className="flex items-center w-[80%]">
                        <Input placeholder="Load Verified Address or Solidity File on Github" onChange={(e) => setSearchResult(e.target.value)} />
                        <SelectChain handleOnChange={handleChainChange} />
                    </div>
                </div>
            </form>
            <DrawerFooter>
                <div className="w-full flex gap-2">
                    <NavItemTheme />
                    <Button onClick={handleLoadContract} className="w-full">Load</Button>
                </div>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
}
