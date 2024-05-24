"use client"

import { ChainID } from "@/lib/chains";
import { Input } from "../ui/input";
import { useState } from "react";
import { SelectChain } from "./select-chain";
import { Button } from "../ui/button";
import { useRouter } from 'next/navigation';
import { isAddress } from "ethers";
import { Github, Twitter, X } from "lucide-react";
import Link from "next/link";

interface LoadContractPageProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function LoadContractPage({ }: LoadContractPageProps) {
    const { push } = useRouter();

    const [selectedChain, setSelectedChain] = useState<string>(ChainID.ETHEREUM_MAINNET)
    const [contractAddress, setContractAddress] = useState<string>("")
    const [githubContract, setGithubContract] = useState<string>("")

    const handleChainChange = (chainId: string) => {
        setSelectedChain(chainId)
    }

    const handleLoadContract = () => {
        console.log("Load contract from chain", githubContract, contractAddress, selectedChain)
        if (githubContract.startsWith("https://github.com/") && githubContract.endsWith(".sol")) {
            push(`/?url=${githubContract}`)
            return
        }

        if (selectedChain && isAddress(contractAddress)) {
            push(`/address/${selectedChain}/${contractAddress}`)
            return
        }

        console.error("Invalid contract address or github url")
    }

    return <div className="w-full h-[100vh] flex items-center justify-center">
        <div className="w-[65%]">
            <div>
                <div>Load from Github</div>
                <Input onChange={(e) => setGithubContract(e.target.value)} />
            </div>
            <div className="text-center my-4">OR</div>
            <div>
                <div>Load from Blockchain</div>
                <div className="grid grid-cols-12">
                    <div className="col-span-12 lg:col-span-9">
                        <Input onChange={(e) => setContractAddress(e.target.value)} />
                    </div>
                    <div className="col-span-12 lg:col-span-3 order-1">
                        <SelectChain handleOnChange={handleChainChange} />
                    </div>
                </div>
            </div>

            <Button className="mt-4 w-full"
                disabled={contractAddress.length === 0 && githubContract.length === 0}
                onClick={handleLoadContract}>Load</Button>

            <div className="flex justify-center my-32 gap-4">
                <Link href="https://github.com/solide-project" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-primary">
                    <Github size={24} />
                </Link>
                <Link href="twitter.com/SolideProject" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-primary">
                    <Twitter size={24} />
                </Link>
            </div>
        </div>
    </div>
}