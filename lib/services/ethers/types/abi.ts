export interface ABIParameter {
    internalType: string;
    name: string;
    type: string;
}

export interface ABIEntry {
    inputs: ABIParameter[];
    name: string;
    type: string;
    constant: boolean;
    stateMutability: "pure" | "view" | "nonpayable" | "payable";
    payable: boolean;
    outputs?: ABIParameter[];
}