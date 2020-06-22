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
        cmd: ["deno", "test", "--unstable", "-A", "command_test.ts"],
        stdout: "piped",
        stderr: "piped",
        cwd: pathToHere
      });
      const status = await p.status();
      p.close();
    }
  });
}
