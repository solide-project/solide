import { useEffect, useState } from "react"
import { useSyncProviders } from "./hooks/useSyncProviders"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export const ConnectWallet = () => {
    const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail>()
    const [userAccount, setUserAccount] = useState<string>("")
    const providers = useSyncProviders()

    useEffect(() => {
        window.ethereum.on('accountsChanged', function (accounts: any[]) {
            setUserAccount(accounts?.[0])
        })
    }, [])

    const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
        try {
            const accounts: any[] = await providerWithInfo.provider.request({
                method: "eth_requestAccounts"
            }) as any[]

            setSelectedWallet(providerWithInfo)
            setUserAccount(accounts?.[0])
        } catch (error) {
            console.error(error)
        }
    }

    const handleDisconnect = async () => {
        setSelectedWallet(undefined)
        setUserAccount("")
    }

    const metaMaskProvider = providers.length > 0
        ? providers
            .filter((provider: EIP6963ProviderDetail) => provider.info.name.toLowerCase() === "metamask")
            .pop()
        : null;

    return (
        <>
            {!userAccount && metaMaskProvider &&
                <button
                    className={cn(buttonVariants({ size: "sm", variant: "outline" }), "w-full")}
                    key={metaMaskProvider.info.uuid} onClick={() => handleConnect(metaMaskProvider)}>
                    Connect Wallet
                </button>}
            {userAccount &&
                <div className={cn(buttonVariants({ size: "sm", variant: "outline" }), "w-full")}
                    onClick={() => handleDisconnect()}>
                    {userAccount}
                </div >}
        </>
    )
}