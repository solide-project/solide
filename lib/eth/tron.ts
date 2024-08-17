import { InvokeParam, ISmartContract } from "./interfaces";

export class TronSmartContract implements ISmartContract {
    contractAddress: string;
    contract: any;
    abi: any;
    constructor(address: string, abi: any) {
        if (!window.tronWeb) {
            throw new Error("TronWeb not found. Please install TronLink or TronPay.")
        }

        this.abi = abi
        this.contractAddress = address
        console.log("Contract address", address)
        this.contract = window.tronWeb.contract(abi, window.tronWeb.address.toHex(address))
    }

    async call({ method, args }: InvokeParam): Promise<any> {
        console.log("Calling", method, args, window.tronWeb.address.toHex(this.contractAddress))
        return this.contract[method](...args).call()
    }

    async send({ method, args, value = "0", gas = "0" }: InvokeParam): Promise<any> {
        return this.contract[method](...args).send()
    }
}

export const deploy = async (
    abi: any,
    bytecode: string,
    args: any[],
    name: string
) => {
    const tx = await window.tronWeb.transactionBuilder.createSmartContract(
        {
            feeLimit: 1000000000,
            callValue: 0,
            userFeePercentage: 100,
            originEnergyLimit: 10000000,
            abi: JSON.stringify(abi),
            bytecode: bytecode,
            parameters: args,
            name,
        },
        window.tronWeb.defaultAddress.hex
    )

    const signedTx = await window.tronWeb.trx.sign(tx)
    await window.tronWeb.trx.sendRawTransaction(signedTx)

    const transactionHash = await window.tronWeb.trx.getTransaction(signedTx.txID)
    console.log("Deployed contract", transactionHash, window.tronWeb.trx, window.tronWeb.trx.tronweb)
    const contractAddress: string = window.tronWeb.address.fromHex(
        transactionHash.contract_address
    )

    console.log("Deployed contract", contractAddress)
    return {
        contract: contractAddress,
        transactionHash,
    }
}

export const getContract = (address: string, abi: any) => {
    return window.tronWeb.contract(abi, window.tronWeb.address.toHex(address))
}

export const toEVMAddress = (address: string) => {
    let rand: string = window.tronWeb.address.toHex(address)
    if (rand && rand.startsWith("41")) {
        rand = rand.replace("41", "0x")
    }

    return rand
}

export interface AssetNet {
    key: string
    value: number
}

export interface NetworkUsage {
    freeNetUsed: number
    freeNetLimit: number
    assetNetUsed: AssetNet[]
    assetNetLimit: AssetNet[]
    TotalNetLimit: number
    TotalNetWeight: number
    tronPowerLimit: number
    EnergyUsed: number
    EnergyLimit: number
    TotalEnergyLimit: number
    TotalEnergyWeight: number
}
