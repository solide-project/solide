import { useRef } from "react";
import { SolidePluginsMessage } from "./messages";

export const usePluginHook = () => {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const sendCompilationDetails = (data: any) => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            const message = {
                target: SolidePluginsMessage.SOLIDE_COMPILATION_DETAILS.toString(),
                data: JSON.stringify(data)
            }
            iframe.contentWindow.postMessage(message, "*");
        }
    }

    const sendContractAddress = (data: string) => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            const message = {
                target: SolidePluginsMessage.SOLIDE_CONTRACT_ADDRESS.toString(),
                data,
            }
            iframe.contentWindow.postMessage(message, "*");
        }
    }

    const sendChainChange = (data: string) => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            const message = {
                target: SolidePluginsMessage.SOLIDE_CHAIN_CHANGED.toString(),
                data,
            }
            iframe.contentWindow.postMessage(message, "*");
        }
    }

    return {
        iframeRef,
        sendCompilationDetails,
        sendContractAddress,
        sendChainChange,
    }
};