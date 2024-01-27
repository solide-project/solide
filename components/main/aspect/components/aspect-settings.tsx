import { Checkbox } from "@radix-ui/react-checkbox"
import { Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

import { IDESettings } from "../../shared/nav/ide-settings"
import { SolVersion } from "../../shared/nav/sol-version"

interface AspectSettingsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AspectSettings({ children, className }: AspectSettingsProps) {
  return (
    <IDESettings>
      <div className="flex flex-col gap-2 text-xs lg:gap-8 lg:text-base">
        No Settings
      </div>
    </IDESettings>
  )
}
