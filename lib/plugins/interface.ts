export interface SolidePlugin {
    name: string;
    version: string;
    load: () => void;
    unload?: () => void;
}