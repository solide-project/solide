"use client"

import * as React from "react"
import { AlertCircle, AlertTriangle } from "lucide-react"

import { useEVM } from "../evm-provider"

interface CompileErrorsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CompileErrors({}: CompileErrorsProps) {
  const evm = useEVM()
  const loadIcon = (severity: string) => {
    switch (severity.toLocaleLowerCase()) {
      case "error":
        return <AlertTriangle color="#b91c1c" />
      default:
        ;<AlertCircle />
    }
  }
  return (
    <div className="h-full overflow-y-auto">
      {evm.errors &&
        evm.errors.details &&
        evm.errors.details.map((detail, index) => {
          return (
            <div
              key={index}
              className="relative m-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
              role="alert"
            >
              <div>{loadIcon(detail.severity)}</div>
              <div className="font-bold">{detail.message}</div>
              <pre
                className=""
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >
                {detail.formattedMessage || "Unknown Error"}
              </pre>
            </div>
          )
        })}
    </div>
  )
}
