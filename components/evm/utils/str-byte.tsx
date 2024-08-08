"use client"

import { useCallback, useState } from "react"
import { decodeBytes32String, encodeBytes32String } from "ethers"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface StringToByte32Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function StringToByte32({}: StringToByte32Props) {
  const [data, setData] = useState<string>("")
  const [result, setResult] = useState<string>("")

  const handleStringToHex = useCallback(() => {
    try {
      const encodedResult = encodeBytes32String(data)
      setResult(encodedResult)
    } catch (e: any) {
      setResult(`Error: ${e.message}`)
    }
  }, [data])

  const handleHexToString = useCallback(() => {
    try {
      const decodedResult = decodeBytes32String(data)
      setResult(decodedResult)
    } catch (e: any) {
      setResult(`Error: ${e.message}`)
    }
  }, [data])

  return (
    <>
      <Input
        onChange={(e) => setData(e.target.value)}
        value={data}
        placeholder="data"
      />
      <div className="flex space-x-2">
        <Button className="my-2" size="sm" onClick={handleStringToHex}>
          to Hex
        </Button>
        <Button className="my-2" size="sm" onClick={handleHexToString}>
          to String
        </Button>
      </div>
      <div className="text-wrap break-words">{result}</div>
    </>
  )
}
