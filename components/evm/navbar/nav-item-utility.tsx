"use client"

import { UtilityPole } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useNav } from "@/components/core/providers/navbar-provider"

interface NavItemUtilityProps extends React.HTMLAttributes<HTMLButtonElement> {}

export const UTILITY_KEY = "utility"

export function NavItemUtility({ ...props }: NavItemUtilityProps) {
  const { isNavItemActive, setNavItemActive } = useNav()

  const handleOnClick = async (event: any) => {
    setNavItemActive(UTILITY_KEY)
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
      <UtilityPole
        className={isNavItemActive(UTILITY_KEY) ? "" : "text-grayscale-250"}
      />
    </Button>
  )
}
