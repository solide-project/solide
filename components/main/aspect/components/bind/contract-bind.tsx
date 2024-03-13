import { useState } from "react"
import { Signer, ethers } from "ethers"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContractMetadata } from "@/components/main/shared/components/contract-metadata"

import { useAspect } from "../../provider/aspect-provider"
import { LoadEVMContract } from "./load-evm-contract"
import { ContractInvoke } from "./contract-invoke"
import { ContractAspects } from "./contract-aspects"
import { Service } from "@/lib/services/aspect/aspect-service"

interface ContractBindProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectAddress?: string
}

export function ContractBind({ aspectAddress, className }: ContractBindProps) {
  const { aspectSDK } = useAspect()

  const [error, setError] = useState<string>("")

  const [contractAddress, setContractAddress] = useState("")
  const [contract, setContract] = useState<ethers.Contract | undefined>()

  const [abi, setABI] = useState<string>("")
  const [isABI, setIsABI] = useState<boolean>(false)

  const handleContractAddress = async (address: string) => {
    setContractAddress(address)

    if (ethers.isAddress(address) && isABI) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner() as Signer

      setContract(new ethers.Contract(address, JSON.parse(abi || "[]"), signer))
    }
  }

  const handleSetABI = async (abi: string) => {
    try {
      setABI(abi)

      const parsedABI = JSON.parse(abi)
      if (Array.isArray(parsedABI)) {
        setError("")
        setIsABI(true)

        if (ethers.isAddress(contractAddress)) {
          const provider = new ethers.BrowserProvider(window.ethereum)
          await provider.send("eth_requestAccounts", [])
          const signer = await provider.getSigner() as Signer

          setContract(new ethers.Contract(contractAddress, JSON.parse(abi), signer))
        }
      }
    } catch (error) {
      setError("ABI is not valid")
      setIsABI(false)
    }
  }

  const bind = async () => {
    if (!aspectAddress || !contractAddress) return
    if (!abi) return

    try {
      const parsedABI = JSON.parse(abi)
      // console.log(aspectAddress, contractAddress, parsedABI)

      const receipt: Service.Aspect.AspectTransactionReceipt = await aspectSDK.bind(
        contractAddress,
        aspectAddress,
        parsedABI
      )

      // console.log(receipt)
    } catch (error: any) {
      if (error.toString().includes("is not valid JSON")) {
        setError("ABI is not valid")
      } else {
        setError(error.toString())
      }
    }
  }

  return (
    <div className={cn("", className)}>
      <div className="my-2">Bind to Artela Smart Contract</div>

      <Input
        className="h-9 rounded-md px-3"
        placeholder="Binding Contract Address"
        // value={contractAddress}
        onChange={(e) => handleContractAddress(e.target.value)}
      />

      <ContractMetadata name="Contract Tools">
        <div className="space-y-2">
          {ethers.isAddress(contractAddress || "") && (
            <LoadEVMContract contractAddress={contractAddress} />
          )}
          <ContractAspects contractAddress={contractAddress} />
        </div>
      </ContractMetadata>

      <ContractMetadata name="ABI">
        {ethers.isAddress(contractAddress || "") && (
          <div>
            <div className="my-2">ABI</div>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => handleSetABI(e.target.value)}
            ></textarea>
          </div>
        )}

        {isABI && ethers.isAddress(contractAddress) &&
          <ContractInvoke contract={contract} abi={JSON.parse(abi)} />}
      </ContractMetadata>

      <Button
        className="my-2"
        variant="destructive"
        disabled={
          !(
            ethers.isAddress(aspectAddress || "") &&
            ethers.isAddress(contractAddress || "")
          )
        }
        onClick={bind}
      >
        {!ethers.isAddress(aspectAddress || "")
          ? "Deploy Aspect to bind"
          : "Bind"}
      </Button>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}
