import { useState } from "react"
import { Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import { IDESettings } from "../../shared/nav/ide-settings"
import { SolVersion } from "../../shared/nav/sol-version"
import { useEVM } from "../provider/evm-provider"

interface EVMSettingsProps extends React.HTMLAttributes<HTMLDivElement> {
  solcVersion: string
}

export function EVMSettings({ solcVersion }: EVMSettingsProps) {
  const { compilerSetting } = useEVM()

  const [optimizerEnabled, setOptimiserEnabled] = useState(false)
  const [optimiserRuns, setOptimiserRuns] = useState(200)

  return (
    <IDESettings>
      <div className="flex flex-col gap-2 text-xs lg:gap-8 lg:text-base">
        <div>
          <div className="my-2">Compiler</div>
          <SolVersion version={solcVersion} />
        </div>

        <div>
          <div className="my-2">Runs</div>
          <Input
            type="number"
            max={1300}
            min={200}
            value={optimiserRuns}
            onChange={(e: any) => {
              compilerSetting.setOptimiserRuns(parseInt(e.target.value))
              setOptimiserRuns(parseInt(e.target.value))
            }}
          />
        </div>

        <div className="flex items-center space-x-2 rounded-md bg-grayscale-100 px-4 py-1 lg:px-4 lg:py-4">
          <Checkbox
            id="optimizer"
            checked={optimizerEnabled}
            onClick={(e: any) => {
              compilerSetting.setOptimiserEnabled(
                !optimizerEnabled,
                optimiserRuns
              )
              setOptimiserEnabled(!optimizerEnabled)
            }}
          />
          <label
            htmlFor="optimizer"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable optimization (Note enable may timeout on large contracts)
          </label>
        </div>

        {/* <div className="flex items-center space-x-2 rounded-md bg-grayscale-100 px-4 py-4">
                    <Checkbox
                        id="viaIR"
                        checked={viaIR}
                        onClick={handleViaIR}
                        disabled={true}
                    />
                    <label
                        htmlFor="viaIR"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Use CLI (Coming Soon)
                    </label>
                </div> */}
      </div>
    </IDESettings>
  )
}
