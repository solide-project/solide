import { useState } from "react"
import { ethers } from "ethers"

import { AspectTransactionReceipt, ContractAspect } from "@/lib/aspect/aspect-service"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContractMetadata } from "@/components/main/shared/components/contract-metadata"

import { useAspect } from "../../provider/aspect-provider"
import { LoadEVMContract } from "./load-evm-contract"

interface ContractBindProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectAddress?: string
}

export function ContractBind({ aspectAddress, className }: ContractBindProps) {
  const { aspectSDK } = useAspect()

  const [error, setError] = useState<string>("")

  const [contractAddress, setContractAddress] = useState("")
  const [contractAspects, setContractAspects] = useState<ContractAspect[] | null>(null)

  const [abi, setABI] = useState<string>("")

  const bind = async () => {
    if (!aspectAddress || !contractAddress) return
    if (!abi) return

    try {
      const parsedABI = JSON.parse(abi)
      // console.log(aspectAddress, contractAddress, parsedABI)

      const receipt: AspectTransactionReceipt = await aspectSDK.bind(
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

  const getContractAspects = async () => {
    if (!ethers.utils.isAddress(contractAddress)) return

    try {
      const aspects = await aspectSDK.getAspect(contractAddress)
      // console.log(aspects)
      setContractAspects(aspects)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={cn("", className)}>
      <div className="my-2">Bind to Artela Smart Contract</div>

      <Input
        className="h-9 rounded-md px-3"
        placeholder="Binding Contract Address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      />

      <ContractMetadata name="Contract Tools">
        <div className="flex space-x-2">
          <Button className="h-9 rounded-md px-3" onClick={getContractAspects}>
            Load Aspects
          </Button>
          {ethers.utils.isAddress(contractAddress || "") && (
            <LoadEVMContract contractAddress={contractAddress} />
          )}
        </div>
        {contractAspects && (
          <div className="my-4 max-h-[200px] overflow-y-auto">
            <Button
              size="sm"
              variant="outline"
              className="flex"
              onClick={() => {
                setContractAspects(null)
              }}
            >
              Clear
            </Button>

            {contractAspects.length > 0 ? (
              contractAspects.map((aspect: any) => (
                <div key={aspect.aspectId}>
                  {aspect.aspectId} {`(v${aspect.version})`}
                </div>
              ))
            ) : (
              <div>Contract is not binded to any Aspect</div>
            )}
          </div>
        )}
      </ContractMetadata>

      {ethers.utils.isAddress(contractAddress || "") && (
        <div>
          <div className="my-2">ABI</div>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => setABI(e.target.value)}
          ></textarea>
        </div>
      )}

      <Button
        className="my-2"
        variant="destructive"
        disabled={
          !(
            ethers.utils.isAddress(aspectAddress || "") &&
            ethers.utils.isAddress(contractAddress || "")
          )
        }
        onClick={bind}
      >
        {!ethers.utils.isAddress(aspectAddress || "")
          ? "Deploy Aspect to bind"
          : "Bind"}
      </Button>

      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}
