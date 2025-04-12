import { useEffect } from "react";
import { useEVM } from "../evm/evm-provider";
import { usePluginHook } from "@/lib/plugins/plugin-hook";
import { SolidePluginsMessage } from "@/lib/plugins/messages";
import { PLUGINS_URLS } from "@/lib/plugins/whitelist";
import { useLogger } from "../core/providers/logger-provider";
import { hexToString } from "@/lib/eth/chains";

interface PluginLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    src: string
}

export function PluginLoader({ src }: PluginLoaderProps) {
    const evm = useEVM()
    const logger = useLogger()
    const { iframeRef, ...plugin } = usePluginHook()

    useEffect(() => {
        const applyParentStyles = () => {
            const iframe = iframeRef.current;
            if (!iframe || !iframe.contentWindow) return;

            const css = Array.from(document.styleSheets)
                .map((s) => s.href)
                .filter((href): href is string => Boolean(href));

            const computedStyle = getComputedStyle(document.body);
            const fontFamily = computedStyle.fontFamily;
            const fontSize = computedStyle.fontSize;

            iframe.contentWindow.postMessage({
                type: "apply-styles",
                css,
                fontFamily,
                fontSize
            }, "*");
        };

        if (iframeRef.current) {
            iframeRef.current.onload = applyParentStyles;
        }
    }, []);

    // To emit message to plugins when ide chain changes
    useEffect(() => {
        window.ethereum
            .on("chainChanged", handleChainChanged)

        function handleChainChanged(chain: any) {
            console.log("Change")
            plugin.sendChainChange(chain)
        }
    }, []);

    useEffect(() => {
        plugin.sendCompilationDetails(JSON.stringify(evm.selectedCompiledContract))
    }, [evm.selectedCompiledContract])

    useEffect(() => {
        plugin.sendContractAddress(evm.selectedContractAddress)
    }, [evm.selectedContractAddress])

    const handleClick = async () => {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x1" }],
        })
    }

    return <>
        <button onClick={handleClick}>Send Message to Plugin</button>
        <a href={src} target="_blank">Load Source</a>

        <iframe ref={iframeRef} id="plugin-iframe" src={src}
            allow="clipboard-read; clipboard-write"
            style={{ width: "100%", height: "500px" }} />
    </>
}


