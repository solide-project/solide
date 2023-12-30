import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const solcVersion = "v0.8.23+commit.f704f362";

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

function getFileNameWithoutExtension(filename: string) {
  return filename.replace(/\.[^/.]+$/, "");
}

export async function getEntryDetails(output: any, entry: string) {
  entry = getFileNameWithoutExtension(entry);
  return new Promise((resolve, reject) => {
    Object.keys(output.contracts).forEach((contractSource) => {
      if (contractSource === entry) {
        for (var contractName in output.contracts[entry]) {
          resolve(output.contracts[contractSource][contractName]);
        }
      }
      Object.keys(output.contracts[contractSource]).forEach((contractName) => {
        if (contractName === entry) {
          resolve(output.contracts[contractSource][entry]);
        }
      });
    });

    // If the entryContractName is not found, you might want to reject the promise
    reject(new Error('Entry contract not found'));
  });
}

export const GetSolidityJsonInputFormat = (content: string) => {
  return JSONParse(content.slice(1, -1));
}


export const JSONParse = (content: string) => {
  try {
    const input = JSON.parse(content)
    return input
  } catch (error) {
    return undefined
  }
}