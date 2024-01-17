import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const solcVersion = "v0.8.23+commit.f704f362"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const minify = (str: string) => {
  // Remove whitespace characters (space, tab, newline)
  const minifiedString = str.replace(/\s+/g, " ")

  return minifiedString
}

export const GetSolidityJsonInputFormat = (content: string) => {
  return JSONParse(content.slice(1, -1))
}

export const JSONParse = (content: string) => {
  try {
    const input = JSON.parse(content)
    return input
  } catch (error) {
    return undefined
  }
}
