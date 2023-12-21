"use client"

import { SolcError } from "@/lib/interfaces";
import * as React from "react"

interface CompileErrorsProps
    extends React.HTMLAttributes<HTMLDivElement> {
    errors?: SolcError[];
}

export function CompileErrors({ errors = [] }: CompileErrorsProps) {

    return (
        <div className="overflow-y-scroll" style={{ height: "90vh" }}>
            {errors && errors.map((detail, index) => {
                return <CompileErrorCard key={index} error={detail} />
            })}
        </div>
    )
}


interface CompileErrorCardProps
    extends React.HTMLAttributes<HTMLDivElement> {
    error: SolcError;
}

export function CompileErrorCard({ error }: CompileErrorCardProps) {

    return (
        <div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
            <div className="font-bold">Holy smokes!</div>
            <div className="block sm:inline">{error.formattedMessage}</div>
        </div>
    )
}
