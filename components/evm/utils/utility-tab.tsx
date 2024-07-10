"use client"

import { useState, lazy, Suspense } from "react"
import { cn } from "@/lib/utils"
import { Title } from "@/components/core/components/title"

interface UtiltyTabProps extends React.HTMLAttributes<HTMLDivElement> { }

enum Tab {
    DECODE = "Decode",
    STR2BYTE = "String To Bytes32",
    UNIT = "Unit Conversion",
}

const LazyEventDecoder = lazy(() => import("@/components/evm/utils/event-decoder"))
const LazyStringToByte32 = lazy(() => import("@/components/evm/utils/str-byte"))
const LazyUnitConversion = lazy(() => import("@/components/evm/utils/unit-conversion"))

export function UtiltyTab({ className }: UtiltyTabProps) {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.DECODE)

    const isActive = (tab: Tab) => activeTab === tab

    const tabActive = (tab: Tab) =>
        cn("cursor-pointer", {
            "text-grayscale-250": !isActive(tab),
            "bg-grayscale-200 rounded-lg px-3 py-1": isActive(tab),
        })

    const handleTabClick = (tab: Tab) => {
        setActiveTab(tab)
    }

    return <div className={cn("px-2 pb-4", className)}>
        <Title text="Utility" />

        <div className="mx-2 my-4 flex items-center gap-x-4 text-sm overflow-auto">
            <div className={tabActive(Tab.DECODE)} onClick={() => handleTabClick(Tab.DECODE)}>
                Log Decoder
            </div>
            <div className={tabActive(Tab.STR2BYTE)} onClick={() => handleTabClick(Tab.STR2BYTE)}>
                String to Bytes32
            </div>
            <div className={tabActive(Tab.UNIT)} onClick={() => handleTabClick(Tab.UNIT)}>
                Unit Conversion
            </div>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
            {isActive(Tab.DECODE) && <LazyEventDecoder />}
            {isActive(Tab.STR2BYTE) && <LazyStringToByte32 />}
            {isActive(Tab.UNIT) && <LazyUnitConversion />}
        </Suspense>
    </div>
}