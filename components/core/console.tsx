"use client"

import { useLogger } from "./providers/logger-provider"
import { Title } from "./components/title"

interface ConsoleLoggerProps extends React.HTMLAttributes<HTMLButtonElement> {}

export function ConsoleLogger({ className }: ConsoleLoggerProps) {
  const logger = useLogger()

  const generateColor = (type: string) => {
    switch (type) {
      case "info":
        return "text-blue-500"
      case "error":
        return "text-red-700"
      case "warn":
        return "text-yellow-500"
      default:
        return "text-grayscale-250"
    }
  }

  const extractTimeFromISOString = (isoString: string): string => {
    const date = new Date(isoString)
    const hours = String(date.getUTCHours()).padStart(2, "0")
    const minutes = String(date.getUTCMinutes()).padStart(2, "0")
    const seconds = String(date.getUTCSeconds()).padStart(2, "0")

    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <div className={className}>
      <Title text={"Console"} />
      <div className="flex flex-col">
        {logger.logs.map((log, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-t py-2 break-words"
          >
            <code className={generateColor(log.type)}>{log.text}</code>
            <div>{extractTimeFromISOString(log.timestamp)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
