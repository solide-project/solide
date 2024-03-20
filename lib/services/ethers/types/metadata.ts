export interface Metadata {
    language?: string;
    sources?: any;
    compiler?: {
        version?: string;
    };
    output?: any;
    settings?: {
        optimizer?: {
            enabled?: boolean;
            runs?: number;
        },
        compilationTarget?: {
            [key: string]: string;
        },
        libraries?: {
            [key: string]: string;
        },
        remappings?: string[];
        metadata?: {
            appendCBOR?: boolean;
            useLiteralContent?: boolean;
            bytecodeHash?: "ipfs" | "none" | "bzzr1";
        }
    };
}