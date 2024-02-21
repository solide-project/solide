export namespace Service {
    export namespace ABIService {
        export interface ABIEntry {
            inputs: ABIParameter[];
            name: string;
            type: string;
            constant: boolean;
            stateMutability: "pure" | "view" | "nonpayable" | "payable";
            payable: boolean;
            outputs?: ABIParameter[];
        }

        export interface ABIParameter {
            internalType: string;
            name: string;
            type: string;
        }

        /**
         * Null ensure that it was not a valid ABI
         * @param value 
         */
        export function parse(value: any): ABIEntry[] {
            const parsedABI: ABIEntry[] = JSON.parse(value)

            if (!Array.isArray(parsedABI)) {
                throw new Error("Invalid ABI")
            }

            return parsedABI
        }

        /**
         * Parse and input value to its input type
         * @param inputs 
         * @param value 
         * @returns 
         */
        export function abiParameterToNative(input: ABIParameter, value: any = ""): any {
            const data: any = value.toString();

            if (input.type.includes("int")) {
                value = parseInt(value)
            } else if (input.type.includes("bool")) {
                value = value === "true"
            } 

            return data
        }
    }
}