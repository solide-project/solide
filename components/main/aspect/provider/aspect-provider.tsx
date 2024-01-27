"use client"

import React, { createContext, useContext, useState } from "react"

import { AspectSDK } from "@/lib/aspect/aspect-service"

export const AspectProvider = ({ children }: AspectProviderProps) => {
  const [aspectSDK, _] = useState<AspectSDK>(new AspectSDK())

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
  aspectSDK: {} as AspectSDK,
})

export const useAspect = () => useContext(AspectContext)
