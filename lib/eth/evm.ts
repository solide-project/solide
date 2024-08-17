import { getNetworkDetails } from "./chains";
import { InvokeParam, ISmartContract } from "./interfaces";
import { createPublicClient, createWalletClient, custom } from "viem";

export class EVMSmartContract implements ISmartContract {
    contractAddress: `0x${string}`;
    abi: any;
    constructor(address: string, abi: any) {
        this.contractAddress = address as `0x${string}`;
        this.abi = abi;
    }

    async call({ method, args }: InvokeParam): Promise<any> {
        const publicClient = createPublicClient({
            transport: custom(window.ethereum!),
        })

        const data = await publicClient.readContract({
            address: this.contractAddress,
            abi: this.abi,
            functionName: method,
            args: args,
        })

        return data
    }

    /**
     * value in wei 
     */
    async send({ method, args, value = "0", gas = "1000000" }: InvokeParam): Promise<any> {
        const transport = custom(window.ethereum!)
        const chainId = await window.ethereum.request({ method: "eth_chainId" })

        const publicClient = createPublicClient({ transport, })
        const walletClient = createWalletClient({
            chain: getNetworkDetails(parseInt(chainId, 16).toString()),
            transport,
        })
        const [account] = await walletClient.getAddresses()

        if (!account) {
            throw new Error("No account found")
        }

        const { request } = await publicClient.simulateContract({
            account,
            address: this.contractAddress,
            abi: this.abi,
            functionName: method,
            args: args,
            value: BigInt(value),
            gas: BigInt(gas),
            gasPrice: BigInt("1000000000"),
        })

        console.log(request, value, {
            account,
            address: this.contractAddress,
            abi: this.abi,
            functionName: method,
            args: args,
            value: BigInt(value),
            gas: BigInt(gas),
            gasPrice: BigInt("1000000000"),
        })
        const hash = await walletClient.writeContract(request)

        return hash
    }
}