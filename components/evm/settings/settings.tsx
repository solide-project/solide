import { Info } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IDESettings } from "@/components/core/components/ide-settings"
import { NavItemTheme } from "@/components/core/navbar/nav-item-theme"

import { CompilerOptimised } from "./compiler-optimised"
import { CompilerRuns } from "./compiler-runs"
import { EVMVersions } from "./evm-version"
import { SolidityDBEnabler } from "./solidity-db-enabler"
import { SolidityVersions } from "./solidity-version"

interface EVMSettingsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EVMSettings({ className }: EVMSettingsProps) {
  return (
    <IDESettings>
      <div className="flex items-center justify-between">
        <div className="font-semibold">Mode</div>
        <NavItemTheme />
      </div>
      <div className="flex items-center justify-between">
        <div className="font-semibold">Version</div>
        <SolidityVersions />
      </div>
      <div className="flex items-center justify-between">
        <div className="font-semibold">EVM Version</div>
        <EVMVersions />
      </div>

      <div className="flex items-center justify-between">
        <div className="font-semibold">Runs</div>
        <CompilerRuns />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1">
          <div className="font-semibold">Optimised</div>
          <Tooltip>
            <TooltipTrigger
              asChild={true}
              className="hover:cusor-pointer text-grey-900"
            >
              <Info height={12} />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Note enable may timeout on large contracts</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <CompilerOptimised />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1">
          <div className="font-semibold">Store on Vaulidity</div>
          <Tooltip>
            <TooltipTrigger
              asChild={true}
              className="hover:cusor-pointer text-grey-900"
            >
              <Info height={12} />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Smart contract source code will be stored with BTFS</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <SolidityDBEnabler />
      </div>
    </IDESettings>
  )
}
