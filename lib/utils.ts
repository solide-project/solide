import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const minify = (str: string) => {
  // Remove whitespace characters (space, tab, newline)
  const minifiedString = str.replace(/\s+/g, ' ');

  return minifiedString;
}

export const solcVersion = "v0.8.23+commit.f704f362";
