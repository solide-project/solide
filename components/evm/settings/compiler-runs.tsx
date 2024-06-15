import { Input } from "@/components/ui/input"

import { useEVM } from "../evm-provider"

interface CompilerRunsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CompilerRuns({}: CompilerRunsProps) {
  const evm = useEVM()
  return (
    <Input
      type="number"
      max={1300}
      min={200}
      value={evm.compilerRuns}
      onChange={(e: any) => {
        evm.setCompilerRuns(parseInt(e.target.value))
      }}
    />
  )
}
