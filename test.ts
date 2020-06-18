import { analyzeURL } from "./eggs/src/utilities/registries.ts";

console.log(analyzeURL("https://deno.land/std@version/version.ts"))
console.log(analyzeURL("https://x.nest.land/remove-forever@v1.0.0/mod.ts"))
console.log(analyzeURL("https://deno.land/x/remove_forever@v1.0.0/mod.ts"))
console.log(analyzeURL("https://raw.githubusercontent.com/oganexon/deno-remove-forever/v1.0.0/mod.ts"))