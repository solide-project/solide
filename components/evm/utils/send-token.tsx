"use client"

import { useCallback, useState } from "react"
import { createWalletClient, custom, hexToString, isAddress, stringToHex } from "viem"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SendTokenProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function SendToken({ }: SendTokenProps) {
    const [reciever, setReciever] = useState("")
    const [wei, setWei] = useState(0)
    const [result, setResult] = useState("")
    const [isSending, setIsSending] = useState(false)

    const handleSend = async () => {
        try {
            setResult("")
            setIsSending(true)
            const hash = await doSend()
            setResult(hash)
        } catch (e: any) {
            setResult(e.message)
        } finally {
            setIsSending(false)
        }
    }

    const doSend = async () => {
        if (!isAddress(reciever)) {
            throw new Error("Invalid Address")
        }

        const walletClient = createWalletClient({
            // chain: mainnet,
            transport: custom(window.ethereum!),
        })
        const [account] = await walletClient.getAddresses()

        const hash = await walletClient.sendTransaction({
            account,
            to: reciever as `0x${string}`,
            value: BigInt(wei),
            chain: null
        })

        return hash
    }

    return (
        <>
            <Input
                onChange={(e) => setReciever(e.target.value)}
                value={reciever}
                placeholder="0x"
            />
            <Input type="number"
                onChange={(e) => setWei(parseInt(e.target.value))}
                value={wei}
                placeholder="wei"
            />
            <div className="flex space-x-2">
                <Button className="my-2" size="sm" onClick={handleSend}
                    disabled={isSending}>
                    {isSending ? "Sending ..." : "Send"}
                </Button>
            </div>
            <div className="text-wrap break-words">{result}</div>
        </>
    )
}
