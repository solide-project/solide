"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { utils } from "web3"
import { parseUnits } from "ethers"

interface UnitConversionProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function UnitConversion({ }: UnitConversionProps) {
    const [decimals, setDecimals] = useState<string>("18")
    const [data, setData] = useState<string>("0")

    const [result, setResult] = useState<string>("")

    const handleConvert = () => {
        if (!data || data === "0") {
            return
        }
        const val = parseUnits(data, parseInt(decimals))
        setResult(val.toString())
    }

    const [unit, setUnit] = useState<string>("ether")
    useEffect(() => {
        const d = parseInt(decimals)
        if (d < 0 || d > 18) return

        const unit = Object
            .entries(utils.ethUnitMap)
            .filter(([key, value]) => value === BigInt(`1${"0".repeat(18 - d)}`))
        setUnit("")
        unit.length > 0 && setUnit(unit.map(i => i[0]).join(" "))
    }, [decimals])

    useEffect(() => {
        handleConvert()
    }, [decimals, data])

    const handleDecimalChange = (e: any) => {
        let d = parseInt(e.target.value)
        if (!d) d = 0
        if (d <= 0 || d > 18) d = 0
        setDecimals(d.toString())
    }

    const handleDataChange = (e: any) => {
        let d = parseInt(e.target.value)
        if (!d) d = 0
        if (d <= 0) d = 0
        setData(d.toString())
    }

    return <div>
        <Input type="number" onChange={handleDecimalChange} min={0} max={19} value={decimals} placeholder="decimals" />
        <Input type="number" onChange={handleDataChange} min={0} value={data} placeholder="value" />
        <Button className="my-2" size="sm" onClick={handleConvert}>Decode</Button>
        <div className="break-words text-wrap">{result} {unit}</div>
    </div>
}