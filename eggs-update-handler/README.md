# eggs update handler

Internal module to help eggs handle global updates

**Should only be installed manually for testing**

# Usage

## Module

```ts
import * from "https://x.nest.land/eggs-update-handler@0.5.1/mod.ts"
import * from "https://x.nest.land/eggs-update-handler@0.5.1/lib/registries.ts"

/** Install update handler cli to check for updates and notify user */
function installUpdateHandler(moduleName: string, execName: string, updateCheckInterval?: number): Promise<void>
/** Gets latest version from supported registries */
function getLatestVersion(registry: string, moduleName?: string, owner?: string): Promise<string>
/** Analyzes an URL from supported registries */
function analyzeURL(url: string): {
    moduleName: string;
    version: string;
    versionURL: string;
    registry: string;
    owner: string;
}

/** ... */
```

## CLI

```bash
deno run https://x.nest.land/eggs-update-handler@0.5.1/cli.ts <MODULE> <UPDATE_CHECK_INTERVAL> [ARGS...]
```
