"use client"

import * as React from "react"
import { useState } from "react"

import { SolcError } from "@/lib/interfaces"

const JOINTS = [
  "PreContractCall",
  "PostContractCall",
  "PreTxExecute",
  "PostTxExecute",
  "VerifyTx",
]

interface JointsListProps extends React.HTMLAttributes<HTMLDivElement> {
  setJoints: Function
}

export function JointsList({ setJoints }: JointsListProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([])

  const handleCheckboxChange = (item: string) => {
    if (checkedItems.includes(item)) {
      // If item is already checked, uncheck it
      setCheckedItems(
        checkedItems.filter((checkedItem: string) => checkedItem !== item)
      )
    } else {
      // If item is not checked, check it
      setCheckedItems([...checkedItems, item])
    }

    setJoints(checkedItems)
  }

  return (
    <div>
      {JOINTS.map((item) => (
        <div key={item} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={item}
            checked={checkedItems.includes(item)}
            onChange={() => handleCheckboxChange(item)}
          />
          <div>{item}</div>
        </div>
      ))}
    </div>
  )
}
