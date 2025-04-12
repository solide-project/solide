import { SOLIDE_PLUGIN_KEY } from "@/lib/plugins/whitelist";

export const addPlugin = (plugin: string) => {
    const plugins = JSON.parse(localStorage.getItem(SOLIDE_PLUGIN_KEY) || "[]");

    const updatedPlugins = [...plugins, plugin].filter(
        (value, index, self) => self.indexOf(value) === index
    );

    localStorage.setItem(SOLIDE_PLUGIN_KEY, JSON.stringify(updatedPlugins));
}
