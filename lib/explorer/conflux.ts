import { GetSourceCodeSchema } from "../explorer";

// for Conflux NON-evm API
export const convert = async (
    data: any,
): Promise<GetSourceCodeSchema> => {
    if (data.code !== 0 || !data.data) {
        return {
            status: "0",
            message: "NOTOK",
            result: data.message || "Error loading contract"
        };
    }

    if (data.data && data.data[0]) {
        return {
            status: "1",
            message: "OK",
            result: data.data
        };
    }

    return {
        status: "0",
        message: "NOTOK",
        result: "Invalid contract address"
    };
}