"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Title } from "@/components/core/components/title"
import { EventDecoder } from "@/components/evm/utils/event-decoder"
import { UnitConversion } from "@/components/evm/utils/unit-conversion"
import { StringToByte32 } from "@/components/evm/utils/str-byte"

interface UtiltyTabProps extends React.HTMLAttributes<HTMLDivElement> {
}

enum Tab {
    DECODE = "Decode",
    STR2BYTE = "String To Bytes32",
    UNIT = "Unit Conversion",
}

export function UtiltyTab({ className }: UtiltyTabProps) {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.DECODE)
    const isActive = (tab: string) => activeTab === tab

    const tabActive = (tab: string): string =>
        cn("cursor-pointer", {
            "text-grayscale-250": !isActive(tab),
            "bg-grayscale-200 rounded-lg px-3 py-1": isActive(tab),
        })

    return <div className={cn("px-2 pb-4", className)}>
        <Title text="Utility" />

        <div className="mx-2 my-4 flex items-center gap-x-4 text-sm overflow-auto">
            <div
                className={tabActive(Tab.DECODE)}
                onClick={() => setActiveTab(Tab.DECODE)}
            >
                Log Decoder
            </div>
            <div
                className={tabActive(Tab.STR2BYTE)}
                onClick={() => setActiveTab(Tab.STR2BYTE)}
            >
                String to Bytes32
            </div>
            <div
                className={tabActive(Tab.UNIT)}
                onClick={() => setActiveTab(Tab.UNIT)}
            >
                Unit Conversion
            </div>
        </div>

        {isActive(Tab.DECODE) && <EventDecoder />}
        {isActive(Tab.STR2BYTE) && <StringToByte32 />}
        {isActive(Tab.UNIT) && <UnitConversion />}

    </div>
}