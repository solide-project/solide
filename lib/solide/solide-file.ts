export interface SolideFile {
  content: string
  filePath: string
}

export function isSolideFile(obj: any): obj is SolideFile {
  return (
    typeof obj === "object" &&
    "content" in obj &&
    "filePath" in obj &&
    typeof obj.content === "string" &&
    typeof obj.filePath === "string"
  )
}
