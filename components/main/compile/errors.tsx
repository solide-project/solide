"use client"

import { SolcError } from "@/lib/interfaces";
import { AlertCircle, AlertTriangle } from "lucide-react";
import * as React from "react"

interface CompileErrorsProps
    extends React.HTMLAttributes<HTMLDivElement> {
    errors?: SolcError[];
}

export function CompileErrors({ errors = [] }: CompileErrorsProps) {
    const loadIcon = (severity: string) => {
        switch (severity.toLocaleLowerCase()) {
            case "error":
                return <AlertTriangle color="#b91c1c" />
            default:
                <AlertCircle />
        }
    }
    return (
        <div className="overflow-y-scroll" style={{ height: "90vh" }}>
            {errors && errors.map((detail, index) => {
                return <div key={index} className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 m-4" role="alert">
                    <div >{loadIcon(detail.severity)}</div>
                    <div className="font-bold">{detail.message}</div>
                    <pre className="" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>{detail.formattedMessage || "Unknown Error"}</pre>
                </div>
            })}
        </div>
    )
}
