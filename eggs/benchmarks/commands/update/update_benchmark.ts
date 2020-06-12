import { bench, runBenchmarks } from "./deps.ts"

bench(async function updateCommand(b): Promise<void> {
    b.start();
    const p = await Deno.run({
        cmd: ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "../../../src/main.ts", "update"],
        stdout: "null"
    });
    await p.status();
    b.stop();
});

runBenchmarks();