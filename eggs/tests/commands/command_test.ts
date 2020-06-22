/**
 * Ensure you are running this test at the root of nest.land
 *
 * Requires: --allow-read, --allow-run, --allow-write
 */

import { assertEquals } from "../../src/deps.ts"
import commands from "./commands.ts";

const pathToHere = "eggs/tests/commands/";

for (let i = 0; i < commands.length; i++) {
  const cmd = commands[i];
  Deno.test({
    name: cmd,
    async fn(): Promise<void> {
      const p = await Deno.run({
        cmd: ["deno", "run", "--allow-net", "--unstable", "--allow-read", "--allow-write", "--allow-env", "../../mod.ts", cmd],
        stdout: "piped",
        stderr: "piped",
        cwd: pathToHere
      });
      const status = await p.status();
      const stdout = new TextDecoder("utf-8").decode(await p.output());
        const stderr = new TextDecoder("utf-8").decode(await p.stderrOutput());
      p.close();
    }
  });
}
