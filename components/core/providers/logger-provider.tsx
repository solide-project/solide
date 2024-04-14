"use client"

import React, { createContext, useContext, useState } from "react"

/**
 * VFS Provider to handle files and folders in the IDE
 */
export const LoggerProvider = ({ children }: LoggerProviderProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([])

  const log = (text: string | object, type: LogType) => {
    if (typeof text === "object") {
      text = JSON.stringify(
        text,
        (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
        2
      )
    }
    setLogs((currentLogs: LogEntry[]) => [
      ...currentLogs,
      {
        text,
        type: type,
        timestamp: new Date().toISOString(),
      } as LogEntry,
    ])
  }

  const info = (text: string | object) => {
    log(text, LogOptions.Info)
  }

  const warn = (text: string | object) => {
    log(text, LogOptions.Warning)
  }

  const error = (text: string | object) => {
    log(text, LogOptions.Error)
  }

  const success = (text: string | object) => {
    log(text, LogOptions.Success)
  }

  const clear = () => {
    setLogs([])
  }

  return (
    <LoggerContext.Provider
      value={{
        logs,
        log,
        info,
        error,
        warn,
        success,
        clear,
      }}
    >
      {children}
    </LoggerContext.Provider>
  )
}

interface LoggerProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
}

export const LoggerContext = createContext({
  logs: [] as LogEntry[],
  log: (text: string | object, type: LogType) => {},
  info: (text: string | object) => {},
  error: (text: string | object) => {},
  warn: (text: string | object) => {},
  success: (text: string | object) => {},
  clear: () => {},
})

export const useLogger = () => useContext(LoggerContext)

export type LogType = "success" | "info" | "warning" | "error"
export enum LogOptions {
  Success = "success",
  Info = "info",
  Warning = "warning",
  Error = "error",
}

export interface LogEntry {
  text: string
  type: LogType
  timestamp: string
}
