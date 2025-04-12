"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { NavItemCode } from "@/components/core/navbar/nav-item-code"
import { NavItemConsole } from "@/components/core/navbar/nav-item-console"
import { NavItemContent } from "@/components/core/navbar/nav-item-content"
import { NavItemEditor } from "@/components/core/navbar/nav-item-editor"
import { NavItemFile } from "@/components/core/navbar/nav-item-file"
import { NavItemTheme } from "@/components/core/navbar/nav-item-theme"
import { EVMSelectedChain } from "@/components/evm/evm-selected-chain"
import { NavItemBytecode } from "@/components/evm/navbar/nav-item-bytecode"
import { EVMSettings } from "@/components/evm/settings/settings"

import { NavItemLoader } from "./nav-item-loader"
import { NavItemPlugin } from "./nav-item-plugin"

interface EVMNavBarProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  bytecodeId?: string
}

export function EVMNavBar({ url, bytecodeId }: EVMNavBarProps) {
  return (
    <div className="flex h-full flex-col rounded-lg bg-grayscale-025 px-2 py-4">
      <div className="flex h-full max-h-fit flex-col gap-y-2 overflow-y-auto">
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
        <NavTooltipItem tooltip="Plugin">
          <NavItemPlugin />
        </NavTooltipItem>
        <NavTooltipItem tooltip="Source">
          <NavItemContent url={url} />
        </NavTooltipItem>
        <NavTooltipItem tooltip="Load New Contract">
          <NavItemLoader />
        </NavTooltipItem>
      </div>

      <div className="mt-auto flex flex-col items-center gap-2">
        {bytecodeId && <NavItemBytecode id={bytecodeId} />}
        <EVMSelectedChain />
        <NavItemTheme />
        <EVMSettings />
      </div>
    </div>
  )
}

const NavTooltipItem = ({
  children,
  tooltip,
}: {
  children: React.ReactNode
  tooltip: string
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild={true}>
        <div>{children}</div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}
