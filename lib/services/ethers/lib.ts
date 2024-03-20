/**
 * Check if valid Ethereum address or TRON address
 * @param address 
 * @returns 
 */
export const isAddress = (address: string): boolean =>
    /^(0x)?[0-9a-f]{40}$/i.test(address) || isTronAddress(address);

export const isTronAddress = (address: string): boolean =>
    address.substring(0, 1) === "T" && address.length === 34