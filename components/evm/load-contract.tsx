"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { isAddress } from "ethers"
import { Github, Twitter } from "lucide-react"

import { ChainID } from "@/lib/chains"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { SelectChain } from "./select-chain"

interface LoadContractPageProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
}

export function LoadContractPage({ message }: LoadContractPageProps) {
  const { push } = useRouter()

  const [selectedChain, setSelectedChain] = useState<string>(
    ChainID.ETHEREUM_MAINNET
  )
  const [contractAddress, setContractAddress] = useState<string>("")
  const [githubContract, setGithubContract] = useState<string>("")

  const handleChainChange = (chainId: string) => {
    setSelectedChain(chainId)
  }

  const handleLoadContract = () => {
    console.log(
      "Load contract from chain",
      githubContract,
      contractAddress,
      selectedChain
    )
    if (
      githubContract.startsWith("https://github.com/") &&
      githubContract.endsWith(".sol")
    ) {
      push(`/?url=${githubContract}`)
      return
    }

    if (selectedChain && isAddress(contractAddress)) {
      push(`/address/${selectedChain}/${contractAddress}`)
      return
    }

    console.error("Invalid contract address or github url")
  }

  return (
    <div className="h-screen w-full">
      <div className="my-8 text-center">{message || "Welcome to Solide"}</div>
      <div className="flex items-center justify-center">
        <div className="w-[65%]">
          <div>
            <div>Load from Github</div>
            <Input onChange={(e) => setGithubContract(e.target.value)} />
          </div>
          <div className="my-4 text-center">OR</div>
          <div>
            <div>Load from Blockchain</div>
            <div className="grid grid-cols-12">
              <div className="col-span-12 lg:col-span-9">
                <Input onChange={(e) => setContractAddress(e.target.value)} />
              </div>
              <div className="order-1 col-span-12 lg:col-span-3">
                <SelectChain handleOnChange={handleChainChange} />
              </div>
            </div>
          </div>

          <Button
            className="mt-4 w-full"
            disabled={
              contractAddress.length === 0 && githubContract.length === 0
            }
            onClick={handleLoadContract}
          >
            Load
          </Button>

          <div className="my-32 flex justify-center gap-4">
            <Link
              href="https://github.com/solide-project"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer hover:text-primary"
            >
              <Github size={24} />
            </Link>
            <Link
              href="twitter.com/SolideProject"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer hover:text-primary"
            >
              <Twitter size={24} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
