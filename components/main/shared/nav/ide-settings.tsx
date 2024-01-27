import { Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { SolVersion } from "./sol-version"

interface IDESettingsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function IDESettings({ children, className }: IDESettingsProps) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "default", size: "icon" }))}
      >
        <Settings />
      </DialogTrigger>
      <DialogContent className="overflow-y-auto border-none bg-grayscale-025 shadow-none">
        <DialogHeader>
          <DialogTitle className="mb-0 text-center text-sm lg:mb-6 lg:text-xl">
            Settings
          </DialogTitle>
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
