export interface ContractDependency {
    filePath: string;
    fileContents: string;
    originalContents?: string;
}

export interface CompileResponse {
    abi: any[];
    evm: any;
}

export interface CompileResult {
    data: CompileResponse;
    flattenContract: string;
}

export interface SolcError {
    component: string;
    errorCode: string;
    formattedMessage: string;
    message: string;
    severity: string;
    sourceLocation: any[]; // You might want to provide a more specific type for sourceLocation
    type: string;
}

export interface CompileError {
    details: SolcError[];
}