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

export const getSolidityContract = async (url: string) => {
  if (!url) return "";
  if (!url.startsWith("https://raw.githubusercontent.com")) return "";
  if (!url.endsWith(".sol")) return "";

  const response = await fetch(url);
  if (!response.ok) return "ERror";
  return await response.text();
}

export const solcVersion = "v0.8.23+commit.f704f362";
