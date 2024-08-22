import { Switch } from "@/components/ui/switch"
import { useEVM } from "@/components/evm/evm-provider"

interface SolidityDBEnablerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SolidityDBEnabler({}: SolidityDBEnablerProps) {
  const { useSolidityDB, setUseSolidityDB } = useEVM()
  return (
    <Switch
      checked={useSolidityDB}
      onCheckedChange={() => setUseSolidityDB(!useSolidityDB)}
    />
  )
}
