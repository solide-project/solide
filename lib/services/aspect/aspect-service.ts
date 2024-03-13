import Web3 from "@artela/web3"
import Web3Eth from "@artela/web3-eth"
import { getContractAddress } from "@ethersproject/address"
import { ethers } from "ethers"

export namespace Service {
    export namespace Aspect {
        export const RPC = "https://betanet-rpc1.artela.network"

        export interface KVPair {
            key: string
            value: any
        }

        export interface AspectTransactionReceipt
            extends ethers.TransactionReceipt {
            aspectAddress: string
        }

        export interface ContractAspect {
            aspectId: string;
            priority: string;
            version: string;
        }

        export class AspectSDK {
            web3: Web3
            eth: Web3Eth
            provider: ethers.BrowserProvider | undefined

            ARTELA_ADDR: string = "0x0000000000000000000000000000000000A27E14"
            defaultTransactionReceipt: any = {
                to: "0x0",
                from: "0x0",
                contractAddress: "0x0",
                transactionIndex: 0,
                root: "0x0",
                gasUsed: BigInt(0),
                logsBloom: "0x0",
                blockHash: "0x0",
                transactionHash: "0x0",
                logs: [],
                blockNumber: 0,
                confirmations: 0,
                cumulativeGasUsed: BigInt(0),
                effectiveGasPrice: BigInt(0),
                byzantium: false,
                type: 0,
                status: 0,
            }

            constructor(rpc: string = RPC) {
                this.web3 = new Web3(rpc)
                this.eth = new Web3Eth(rpc)
            }

            async deploy(contractWasm: Blob, properties: KVPair[], joinPoints: any[]) {
                if (!this.provider) {
                    this.provider = new ethers.BrowserProvider(window.ethereum)
                }
                const signer = await this.getSigner()
                this.provider = new ethers.BrowserProvider(window.ethereum)
                const gasPrice = (await this.provider.getFeeData()).gasPrice

                if (!signer) {
                    throw new Error("No signer found")
                }

                // Convert Blob to hex string
                const uint8Array = new Uint8Array(await contractWasm.arrayBuffer())
                const hexString = Array.from(uint8Array)
                    .map((byte) => byte.toString(16).padStart(2, "0"))
                    .join("")

                const aspect = new this.web3.atl.Aspect()
                const deploy = await aspect.deploy({
                    data: "0x" + hexString,
                    properties,
                    joinPoints,
                    paymaster: await signer.getAddress(),
                    proof: "0x0",
                })

                const tx: any = {
                    from: await signer.getAddress(),
                    data: deploy.encodeABI(),
                    to: this.ARTELA_ADDR,
                    gasPrice: Number(gasPrice),
                    gasLimit: 9000000,
                }

                let signedTx: ethers.TransactionResponse =
                    await signer.sendTransaction(tx)
                let receipt: any = await signedTx.wait()

                // Generate the aspect address deployed
                receipt = this.aspectFormatter(signedTx, receipt)
                return receipt
            }

            async bind(contractAddress: string, aspectAddress: string, abi: any[]) {
                const signer = await this.getSigner()
                if (!this.provider) {
                    this.provider = new ethers.BrowserProvider(window.ethereum)
                }

                const gasPrice = (await this.provider.getFeeData()).gasPrice

                if (!signer) {
                    throw new Error("No signer found")
                }

                // const aspect = new this.web3.atl.Aspect(aspectAddress);
                const storageInstance = new this.eth.Contract(abi, contractAddress)
                const bind = await storageInstance.bind({
                    priority: 1,
                    aspectId: aspectAddress,
                    aspectVersion: 1,
                })

                const aspectCore = this.web3.atl.aspectCore()
                const tx = {
                    from: await signer.getAddress(),
                    data: bind.encodeABI(),
                    to: this.ARTELA_ADDR || aspectCore.options.address,
                    // gasPrice: 7,
                    // gas: 9000000
                    gasPrice: Number(gasPrice),
                    gasLimit: 9000000,
                }

                try {
                    let signedTx: ethers.TransactionResponse =
                        await signer.sendTransaction(tx)
                    let receipt: any = await signedTx.wait()

                    return receipt
                } catch (e: any) {
                    console.log(e)
                    return this.defaultTransactionReceipt;
                }
            }

            async entry(aspectAddress: string, operationData: string) {
                const signer = await this.getSigner()
                if (!this.provider) {
                    this.provider = new ethers.BrowserProvider(window.ethereum)
                }
                const gasPrice = (await this.provider.getFeeData()).gasPrice

                if (!signer) {
                    throw new Error("No signer found")
                }

                // const aspect = new this.web3.atl.Aspect(aspectAddress);
                const aspect = new this.web3.atl.Aspect(aspectAddress)
                const encodeABI = aspect.operation(operationData).encodeABI()

                const tx = {
                    from: await signer.getAddress(),
                    to: this.ARTELA_ADDR,
                    data: encodeABI,
                    gasPrice: Number(gasPrice),
                    gasLimit: 9000000,
                }

                try {
                    let signedTx: ethers.TransactionResponse =
                        await signer.sendTransaction(tx)
                    let receipt: any = await signedTx.wait()

                    const data = await this.web3.atl.call({
                        to: this.ARTELA_ADDR, // contract address
                        data: encodeABI,
                    })

                    console.log("data", data)
                    return receipt
                } catch (e: any) {
                    console.log(e)
                    return this.defaultTransactionReceipt
                }
            }

            async upgrade(
                contractWasm: Blob,
                properties: KVPair[],
                joinPoints: any[],
                aspectAddress: string
            ) {
                const signer = await this.getSigner()
                if (!this.provider) {
                    this.provider = new ethers.BrowserProvider(window.ethereum)
                }
                const gasPrice = (await this.provider.getFeeData()).gasPrice

                if (!signer) {
                    throw new Error("No signer found")
                }

                // Convert Blob to hex string
                const uint8Array = new Uint8Array(await contractWasm.arrayBuffer())
                const hexString = Array.from(uint8Array)
                    .map((byte) => byte.toString(16).padStart(2, "0"))
                    .join("")

                const aspect = new this.web3.atl.Aspect(aspectAddress)
                const deploy = await aspect.upgrade({
                    data: "0x" + hexString,
                    properties,
                    joinPoints,
                })

                const tx = {
                    from: await signer.getAddress(),
                    data: deploy.encodeABI(),
                    to: this.ARTELA_ADDR,
                    gasPrice: Number(gasPrice),
                    gasLimit: 9000000,
                }

                try {
                    let signedTx: ethers.TransactionResponse =
                        await signer.sendTransaction(tx)
                    let receipt: any = await signedTx.wait()

                    return receipt
                } catch (e: any) {
                    console.log(e)
                    return this.defaultTransactionReceipt
                }
            }

            async call(contractAddress: string, abi: any[], method: string, params: any[], pk: string) {

                let sender = this.eth.accounts.privateKeyToAccount(pk.trim());
                console.log("from address: ", sender.address);
                this.eth.accounts.wallet.add(sender.privateKey);

                let storageInstance = new this.eth.Contract(abi, contractAddress);
                console.log("storageInstance: ", storageInstance);
                let instance = await storageInstance.methods[method](...params).call();
                return instance;
            }

            async getAspect(contractAddress: string): Promise<ContractAspect[]> {
                var aspectCore = this.web3.atl.aspectCore()
                let result: ContractAspect[] = await aspectCore.methods.aspectsOf(contractAddress).call()

                return result || []
            }

            async getSigner() {
                if (!this.provider) {
                    this.provider = new ethers.BrowserProvider(window.ethereum)
                }
                await this.provider.send("eth_requestAccounts", [])
                return this.provider.getSigner()
            }

            // https://github.com/artela-network/artela-web3.js/blob/85b8991347a92c1963b2ba67b5afb291a2abc9a9/packages/web3-core-method/src/index.js#L1090
            aspectFormatter = (tx: any, receipt: any): AspectTransactionReceipt => {
                receipt.aspectAddress = getContractAddress(tx)
                return receipt
            }
        }
    }
}

