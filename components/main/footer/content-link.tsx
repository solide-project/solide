"use client"

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Box, Github } from "lucide-react";
import Link from "next/link";
import { getExplorer } from "@/lib/chains/explorer";
import { ChainID } from "@/lib/chains/chain-id";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface ContentLinkProps
    extends React.HTMLAttributes<HTMLDivElement> {
    url: string;
    chainId?: string;
}

export function ContentLink({
    url,
    chainId = ChainID.ETHEREUM_MAINNET
}: ContentLinkProps) {
    const [text, setText] = useState<string>(url)

    useEffect(() => {
        if (ethers.utils.isAddress(url)) {
            setText(`${getExplorer(chainId)}/address/${url}`)
        }
    }, [])

    return (
        <Link href={text} target="_blank" className={cn(buttonVariants({ size: "icon", variant: "ghost" }), "border-0 cursor-pointer")}>
            {!ethers.utils.isAddress(url)
                ? <Github className="h-5 w-5" />
                : <Box className="h-5 w-5" />}
        </Link>
    )
}
