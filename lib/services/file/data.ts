export interface SolideFile {
    content: string
    filePath: string
}

export function isSolideFile(obj: any): obj is SolideFile {
    if (typeof obj !== "object") return false;
    if (typeof obj.content !== "string") return false;
    if (typeof obj.filePath !== "string") return false;
    
    return true;
}