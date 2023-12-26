"use client"

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Box, Github } from "lucide-react";
import Link from "next/link";
import { getExplorer } from "@/lib/chains/explorer";
import { ChainID } from "@/lib/chains/chain-id";

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
        <Link href={text} target="_blank">
            {!ethers.utils.isAddress(url)
                ? <Github className="mr-2 h-5 w-5" />
                : <Box className="mr-2 h-5 w-5" />}
        </Link>
    )
}
