"use client"

import * as React from "react"
import { Moon, SunMedium } from "lucide-react"
import { useTheme } from "next-themes"


export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <div
      className="cursor-pointer"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <SunMedium className="h-[1.5rem] w-[1.3rem] dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </div>
  )
}
