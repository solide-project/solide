"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCallback, useEffect, useState } from "react"
import { parseUnits } from "ethers"

interface UnitConversionProps extends React.HTMLAttributes<HTMLDivElement> {
}

const etherUnits: { [key: string]: BigInt } = {
    Gwei: BigInt(1000000000),
    Kwei: BigInt(1000),
    Mwei: BigInt(1000000),
    babbage: BigInt(1000),
    ether: BigInt(1000000000000000000),
    femtoether: BigInt(1000),
    finney: BigInt(1000000000000000),
    gether: BigInt(1000000000000000000000000000),
    grand: BigInt(1000000000000000000000),
    gwei: BigInt(1000000000),
    kether: BigInt(1000000000000000000000),
    kwei: BigInt(1000),
    lovelace: BigInt(1000000),
    mether: BigInt(1000000000000000000000000),
    micro: BigInt(1000000000000),
    microether: BigInt(1000000000000),
    milli: BigInt(1000000000000000),
    milliether: BigInt(1000000000000000),
    mwei: BigInt(1000000),
    nano: BigInt(1000000000),
    nanoether: BigInt(1000000000),
    noether: BigInt(0),
    picoether: BigInt(1000000),
    shannon: BigInt(1000000000),
    szabo: BigInt(1000000000000),
    tether: BigInt(1000000000000000000000000000000),
    wei: BigInt(1)
};

export default function UnitConversion({ }: UnitConversionProps) {
    const [decimals, setDecimals] = useState<string>("18")
    const [data, setData] = useState<string>("0")
    const [result, setResult] = useState<string>("")
    const [unit, setUnit] = useState<string>("ether")

    const handleConvert = useCallback(() => {
        if (!data || data === "0") return
        const val = parseUnits(data, parseInt(decimals))
        setResult(val.toString())
    }, [data, decimals])

    useEffect(() => {
        const d = parseInt(decimals)
        if (d < 0 || d > 18) return

        const unitEntries = Object.entries(etherUnits)
        const matchingUnits = unitEntries.filter(([key, value]) => value === BigInt(`1${"0".repeat(18 - d)}`))
        setUnit(matchingUnits.length > 0 ? matchingUnits.map(i => i[0]).join(" ") : "")
    }, [decimals])

    useEffect(() => {
        handleConvert()
    }, [handleConvert])

    const handleDecimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        setDecimals((!value || value <= 0 || value > 18) ? "0" : value.toString())
    }

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        setData((!value || value <= 0) ? "0" : value.toString())
    }

    return <>
        <Input type="number" onChange={handleDecimalChange}
            min={0} max={19} value={decimals} placeholder="decimals" />
        <Input type="number" onChange={handleDataChange}
            min={0} value={data} placeholder="value" />
        <Button className="my-2" size="sm" onClick={handleConvert}>Decode</Button>
        <div className="break-words text-wrap">{result} {unit}</div>
    </>
}