"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useEVM } from "../evm-provider"
import * as evmUtil from "@/lib/evm"
import { eth } from "web3"

interface EventDecoderProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function EventDecoder({ }: EventDecoderProps) {
    const evm = useEVM()
    const topic = [0, 1, 2, 3]
    const [topics, setTopics] = useState<string[]>([])
    const [data, setData] = useState<string>("")

    const [result, setResult] = useState<any>({} as any)

    const handleSetTopics = (e: any, index: number) => {
        const newTopics = [...topics]
        newTopics[index] = e
        setTopics(newTopics)
    }

    const handleDecode = () => {
        evm.selectedCompiledContract?.abi.filter((a: any) => a.type === "event").forEach((event: evmUtil.ABIEntry) => {
            try {
                // event.inputs.map((input: evmUtil.ABIParameter) => input.internalType) || [],

                const result: any = eth.abi.decodeLog(event.inputs, data, topics);
                // This is a hack to convert bigint to string
                const results = JSON.parse(JSON.stringify(result, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2))
                delete results.__length__
                setResult(results)
            } catch (e) {
                console.error(e)
            }
        })
    }

    return <div>
        {topic.map((t, index) => {
            return <Input key={index} className="my-2"
                onChange={(e) => handleSetTopics(e, index)} value={topics[index]} placeholder={`Topic ${index}`} />
        })}

        <Input onChange={(e) => setData(e.target.value)} value={data} placeholder="data" />
        <Button className="my-2" onClick={handleDecode}>Decode</Button>

        <div className="break-words">
            {Object.entries(result).map(([key, value]) => {
                return <div key={key} className="flex">
                    <div className="font-bold">{key}</div>
                    <div className="ml-2">{JSON.stringify(value)}</div>
                </div>
            })}
        </div>
    </div>
}