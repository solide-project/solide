import { IDESettings } from "@/components/core/components/ide-settings"
import { Title } from "@/components/core/components/title"

import { CompilerOptimised } from "./compiler-optimised"
import { CompilerRuns } from "./compiler-runs"
import { SolidityVersions } from "./solidity-version"
import { EVMVersions } from "./evm-version"
import { SolidityDBEnabler } from "./solidity-db-enabler"

interface EVMSettingsProps extends React.HTMLAttributes<HTMLDivElement> { }

export function EVMSettings({ className }: EVMSettingsProps) {
  return (
    <IDESettings>
      <SolidityVersions />
      <EVMVersions />

      <Title text="Runs" />
      <CompilerRuns />
      <CompilerOptimised />

      <SolidityDBEnabler />
    </IDESettings>
  )
}
