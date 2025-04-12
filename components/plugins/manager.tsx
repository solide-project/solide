import { useEffect, useState } from "react";
import { CollapsibleChevron } from "../core/components/collapsible-chevron";
import { PluginStore } from "./store";
import { IdePlugin, SOLIDE_PLUGIN_KEY } from "@/lib/plugins/whitelist";
import { RefreshCwIcon } from "lucide-react";
import { UtiltyTab } from "../evm/utils/utility-tab";
import { PluginLoader } from ".";

interface PluginManagerProps extends React.HTMLAttributes<HTMLDivElement> { }

const iconsProps = {
    size: 18,
    className: "shrink-0 hover:cursor-pointer hover:text-primary",
}
export function PluginManager({ }: PluginManagerProps) {
    const [activeTab, setActiveTab] = useState("");
    const [plugins, setPlugins] = useState<any[]>([]);

    useEffect(() => {
        refreshPlugins()
    }, [])

    const refreshPlugins = () => {
        const plugins = JSON.parse(localStorage.getItem(SOLIDE_PLUGIN_KEY) || "[]");
        setPlugins(plugins)
    }

    return (
        <div>
            <CollapsibleChevron name="Search for plugins">
                <PluginStore />
            </CollapsibleChevron>

            <RefreshCwIcon {...iconsProps} onClick={refreshPlugins} />

            <div>
                {[...plugins, IdePlugin.NATIVE_UTILITY].map((plugin, index) => {
                    return (
                        <button key={index} onClick={() => setActiveTab(plugin)}>{plugin}</button>
                    )
                })}
            </div>

            <div>
                {plugins.map((plugin, index) => {
                    return (
                        <div key={index} style={{ display: activeTab === plugin ? "block" : "none" }}>
                            <PluginLoader src={"http://localhost:5173"} />
                        </div>
                    )
                })}
                <div style={{ display: activeTab === IdePlugin.NATIVE_UTILITY ? "block" : "none" }}>
                    <UtiltyTab />
                </div>
            </div>
        </div>
    );
};
