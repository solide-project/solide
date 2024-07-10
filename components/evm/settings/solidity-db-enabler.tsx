import { Checkbox } from "@/components/ui/checkbox"

import { useEVM } from "../evm-provider"

interface SolidityDBEnablerProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SolidityDBEnabler({ }: SolidityDBEnablerProps) {
    const evm = useEVM()
    return <div className="flex items-center space-x-2 rounded-md bg-grayscale-100 px-4 py-1 lg:px-4 lg:py-4">
        <Checkbox
            id="optimizer"
            checked={evm.useSolidityDB}
            onClick={(e: any) => {
                console.log("useSolidityDB", evm.selectedCompiledContract)
                evm.setUseSolidityDB(!evm.useSolidityDB)
            }}
        />
        <label
            htmlFor="optimizer"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
            Store contract with Solidity DB. (This will make your contract more transparent and verifiable)
        </label>
    </div>
}
