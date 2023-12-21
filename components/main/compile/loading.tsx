"use client"

import * as React from "react"

interface EditorLoadingProps
    extends React.HTMLAttributes<HTMLDivElement> {
    url?: string;
}

export function EditorLoading({ url, }: EditorLoadingProps) {
    return (
        <div className="animate-spin h-5 w-5">
        </div>
    )
}
