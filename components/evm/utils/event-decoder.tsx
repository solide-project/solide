"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"
import { useEVM } from "@/components/evm/evm-provider"
import { eth } from "web3"
import * as evmUtil from "@/lib/evm"

interface EventDecoderProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function EventDecoder({ }: EventDecoderProps) {
    const evm = useEVM()
    const [topics, setTopics] = useState<string[]>(["", "", "", ""])
    const [data, setData] = useState<string>("")
    const [result, setResult] = useState<any>({})

    // Memoized ABI filter to optimize performance
    const eventABIs = useMemo(() => {
        return evm.selectedCompiledContract?.abi?.filter((a: any) => a.type === "event") || []
    }, [evm.selectedCompiledContract?.abi])

    const handleSetTopics = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newTopics = [...topics]
        newTopics[index] = e.target.value
        setTopics(newTopics)
    }

    const handleDecode = () => {
        eventABIs.forEach((event: evmUtil.ABIEntry) => {
            try {
                const decodedResult = eth.abi.decodeLog(event.inputs, data, topics)
                setResult(decodedResult)
            } catch (e) {
                console.error(e)
            }
        })
    }

    return <>
        {topics.map((topic, index) => (
            <Input
                key={index}
                className="my-2"
                onChange={(e) => handleSetTopics(e, index)}
                value={topic}
                placeholder={`Topic ${index}`}
            />
        ))}

        <Input
            onChange={(e) => setData(e.target.value)}
            value={data}
            placeholder="data"
        />
        <Button className="my-2" size="sm" onClick={handleDecode}>
            Decode
        </Button>

        <div className="break-words">
            {Object.entries(result).map(([key, value]) => (
                <div key={key} className="flex">
                    <div className="font-bold">{key}</div>
                    <div className="ml-2">{JSON.stringify(value)}</div>
                </div>
            ))}
        </div>
    </>
}
