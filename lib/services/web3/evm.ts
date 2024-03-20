import { ethers } from "ethers"

export const deploy = async ({
    contract,
    parameters,
}: {
    contract: any,
    parameters: any[],
}) => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = await provider.getSigner()

    const factory = new ethers.ContractFactory(
        contract.abi,
        contract.evm.bytecode.object,
        signer
    )
    const contractInstance: ethers.BaseContract = await factory.deploy(...parameters);
    const address = await contractInstance.getAddress()

    return {
        address
    }
}

export const getContract = async (address: string, abi: any) => {
    const signer = await getSigner()
    if (!signer) {
        throw new Error("No signer found")
    }

    return new ethers.Contract(address, abi, signer)
}

const getSigner = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    return await provider.getSigner()
}
