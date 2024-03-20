/**
 * convert string to CompilerInput
 * @param content 
 * @returns 
 */
export const compiler = (content: string) => {
    return json(content.slice(1, -1))
}

export const json = (content: string) => {
    try {
        const input = JSON.parse(content)
        return input
    } catch (error) {
        return undefined
    }
}
