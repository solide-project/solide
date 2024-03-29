"use client"

import { useState } from "react"
import { Copy } from "lucide-react"

export interface CopyTextItem {
  title: string
  payload: string
}

interface CopyTextProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  payload: string
}

export function CopyText({ title, payload }: CopyTextProps) {
  const [text, setText] = useState<string>(title)

  function copyText(entryText: string) {
    setText("Copied!")
    navigator.clipboard.writeText(entryText)
    setTimeout(() => {
      setText(title)
    }, 1000)
  }

  return (
    <div
      className="flex cursor-pointer items-center space-x-2 text-sm lg:text-base"
      onClick={() => copyText(payload || "")}
    >
      <div>{text}</div>
      <Copy className="h-3 w-3 lg:h-5 lg:w-5" />
    </div>
  )
}
