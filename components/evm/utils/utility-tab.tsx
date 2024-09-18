"use client"

import { Suspense, lazy, useState } from "react"

import { cn } from "@/lib/utils"
import { Title } from "@/components/core/components/title"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UtiltyTabProps extends React.HTMLAttributes<HTMLDivElement> { }

enum Tab {
  DECODE = "Decode",
  STR2BYTE = "String To Bytes32",
  UNIT = "Unit Conversion",
  SEND = "Transfer Token"
}

const LazyEventDecoder = lazy(
  () => import("@/components/evm/utils/event-decoder")
)
const LazyStringToByte32 = lazy(() => import("@/components/evm/utils/str-byte"))
const LazyUnitConversion = lazy(
  () => import("@/components/evm/utils/unit-conversion")
)
const LazySendToken = lazy(
  () => import("@/components/evm/utils/send-token")
)

const tabs = [
  Tab.DECODE,
  Tab.STR2BYTE,
  Tab.UNIT,
  Tab.SEND
]
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

  return (
    <div className={cn("px-2 pb-4", className)}>
      <Title text="Utility" />

      <Select onValueChange={(val: string) => handleTabClick(val as Tab)}>
        <SelectTrigger className="w-full mb-2 bg-transparent border-none font-bold flex items-center justify-center space-x-4">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {tabs.map((tab, index) => (
            <SelectItem key={index} value={tab}>{tab}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Suspense fallback={<div>Loading...</div>}>
        {isActive(Tab.DECODE) && <LazyEventDecoder />}
        {isActive(Tab.STR2BYTE) && <LazyStringToByte32 />}
        {isActive(Tab.UNIT) && <LazyUnitConversion />}
        {isActive(Tab.SEND) && <LazySendToken />}
      </Suspense>
    </div>
  )
}
