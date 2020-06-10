import { path, existsSync } from "../deps.ts";

export function getCurrentDirectoryBase() {
    return path.basename(process.cwd());
}

export function directoryExists(filePath) {
    return existsSync(filePath);
}