"use client"

import { Plug2Icon, UtilityPole } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useNav } from "@/components/core/providers/navbar-provider"

interface NavItemPluginProps extends React.HTMLAttributes<HTMLButtonElement> { }

export const PLUGIN_KEY = "plugin"

export function NavItemPlugin({ ...props }: NavItemPluginProps) {
  const { isNavItemActive, setNavItemActive } = useNav()

  const handleOnClick = async (event: any) => {
    setNavItemActive(PLUGIN_KEY)
    props.onClick && props.onClick(event)
  }

  return (
    <Button
      className="cursor-pointer border-0 hover:bg-grayscale-100"
      size="icon"
      variant="ghost"
      onClick={handleOnClick}
      {...props}
    >
      <Plug2Icon
        className={isNavItemActive(PLUGIN_KEY) ? "" : "text-grayscale-250"}
      />
    </Button>
  )
}
