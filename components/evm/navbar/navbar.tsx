"use client"

import { NavItemCode } from "@/components/core/navbar/nav-item-code"
import { NavItemContent } from "@/components/core/navbar/nav-item-content"
import { NavItemEditor } from "@/components/core/navbar/nav-item-editor"
import { NavItemFile } from "@/components/core/navbar/nav-item-file"
import { NavItemTheme } from "@/components/core/navbar/nav-item-theme"

import { NavItemConsole } from "@/components/core/navbar/nav-item-console"
import { EVMSelectedChain } from "@/components/evm/evm-selected-chain"
import { EVMSettings } from "@/components/evm/settings/settings"
import { NavItemBytecode } from "@/components/evm/navbar/nav-item-bytecode"
import { useFileSystem } from "@/components/core/providers/file-provider"
import { NavItemDownloader } from "@/components/evm/navbar/nav-item-downloader"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface EVMNavBarProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string,
  bytecodeId?: string,
}

export function EVMNavBar({
  url,
  bytecodeId
}: EVMNavBarProps) {
  return (
    <div className="flex h-full flex-col gap-y-2 rounded-lg bg-grayscale-025 px-2 py-4">
      <NavTooltipItem tooltip="File Explorer">
        <NavItemFile />
      </NavTooltipItem>
      <NavTooltipItem tooltip="Build & Deploy">
        <NavItemCode />
      </NavTooltipItem>
      <NavTooltipItem tooltip="Editor">
        <NavItemEditor />
      </NavTooltipItem>
      <NavTooltipItem tooltip="Console">
        <NavItemConsole />
      </NavTooltipItem>
      <NavTooltipItem tooltip="Source">
        <NavItemContent url={url} />
      </NavTooltipItem>
      <NavTooltipItem tooltip="Download Smart Contract">
        <NavItemDownloader />
      </NavTooltipItem>

      <div className="mt-auto flex flex-col items-center gap-2">
        {bytecodeId && <NavItemBytecode id={bytecodeId} />}
        <EVMSelectedChain />
        <NavItemTheme />
        <EVMSettings />
      </div>
    </div>
  )
}


const NavTooltipItem = ({ children, tooltip }: { children: React.ReactNode, tooltip: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild={true}>
        <div>
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}