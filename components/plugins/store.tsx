import { useEffect, useState } from "react";
import { CollapsibleChevron } from "../core/components/collapsible-chevron";
import { Input } from "../ui/input";
import { IdePlugin, SOLIDE_PLUGIN_KEY } from "@/lib/plugins/whitelist";
import { Plus } from "lucide-react";
import { useLogger } from "../core/providers/logger-provider";
import { addPlugin } from "./shared";

interface PluginStoreProps extends React.HTMLAttributes<HTMLDivElement> { }

const store = [
    {
        id: IdePlugin.COTI_PLUGIN,
        name: "Coti Plugin Manager",
        url: "http://localhost:5173"
    }
]

export function PluginStore({ }: PluginStoreProps) {
    const logger = useLogger()

    const [pluginResults, setPluginResults] = useState<any[]>([]);

    const searchPlugins = (value: string) => {
        const plugins = store.filter(x => x.name
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())) || []
        setPluginResults(plugins)
    }

    const handleAdd = (plugin: string) => {
        addPlugin(plugin)
        logger.info(`Plugin Added: ${plugin}`)

    }

    return (
        <>
            <Input type="text" onChange={(e) => searchPlugins(e.target.value)} />

            <div>
                {(pluginResults || store).map((plugin, index) => {
                    return (
                        <div key={index} className="flex justify-between items-center">
                            <div>{plugin.name}</div>
                            <Plus className="cursor-pointer hover:text-primary" onClick={() => handleAdd(plugin.id)} />
                        </div>
                    )
                })}
            </div>
        </>
    );
};
