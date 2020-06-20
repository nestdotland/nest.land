export type ConfigFormats = "yaml" | "yml" | "json";
export interface Config {
    name?: string;
    description?: string;
    stable?: boolean;
    files?: string[]
}
