"use client"

import { Service } from "@/lib/services/aspect/aspect-service"
import React, { createContext, useContext, useState } from "react"

export const AspectProvider = ({ children }: AspectProviderProps) => {
  const [aspectSDK, _] = useState<Service.Aspect.AspectSDK>(new Service.Aspect.AspectSDK())

  return (
    <AspectContext.Provider
      value={{
        aspectSDK,
      }}
    >
      {children}
    </AspectContext.Provider>
  )
}

interface AspectProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
}

export const AspectContext = createContext({
  aspectSDK: {} as Service.Aspect.AspectSDK,
})

export const useAspect = () => useContext(AspectContext)
