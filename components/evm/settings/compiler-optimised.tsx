import { Checkbox } from "@/components/ui/checkbox"

import { useEVM } from "../evm-provider"

interface CompilerOptimisedProps extends React.HTMLAttributes<HTMLDivElement> { }

export function CompilerOptimised({ }: CompilerOptimisedProps) {
  const evm = useEVM()
  return <div className="flex items-center space-x-2 rounded-md bg-grayscale-100 px-4 py-1 lg:px-4 lg:py-4">
    <Checkbox
      id="optimizer"
      checked={evm.compilerOptimised}
      onClick={(e: any) => {
        evm.setCompilerOptimised(!evm.compilerOptimised)
      }}
    />
    <label
      htmlFor="optimizer"
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Enable optimization (Note enable may timeout on large contracts)
    </label>
  </div>
}
