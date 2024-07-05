"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ethers } from "ethers"

interface StringToByte32Props extends React.HTMLAttributes<HTMLDivElement> {
}

export function StringToByte32({ }: StringToByte32Props) {
    const [data, setData] = useState<string>("")
    const [result, setResult] = useState<string>("")
    const [error, setErrors] = useState<string>("")

    const handleStringToHex = () => {
        try {
            setErrors("")
            const result = ethers.encodeBytes32String(data)
            setResult(result)
        } catch (e: any) {
            console.error(e)
            setErrors(e.message)
        }
    }

    const handleHexToString = () => {
        try {
            setErrors("")
            const result = ethers.decodeBytes32String(data)
            setResult(result)
        } catch (e: any) {
            console.error(e)
            setErrors(e.message)
        }
    }

    return <div>
        <Input onChange={(e) => setData(e.target.value)} value={data} placeholder="data" />
        <div className="flex space-x-2">
            <Button className="my-2" size="sm" onClick={handleStringToHex}>to Hex</Button>
            <Button className="my-2" size="sm" onClick={handleHexToString}>to String</Button>
        </div>
        <div className="break-words text-wrap">{error || result}</div>
    </div>
}