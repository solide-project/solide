import { Switch } from "@/components/ui/switch"
import { useEVM } from "@/components/evm/evm-provider"

interface CompilerOptimisedProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CompilerOptimised({}: CompilerOptimisedProps) {
  const { compilerOptimised, setCompilerOptimised } = useEVM()
  return (
    <Switch
      checked={compilerOptimised}
      onCheckedChange={() => setCompilerOptimised(!compilerOptimised)}
    />
  )
}
