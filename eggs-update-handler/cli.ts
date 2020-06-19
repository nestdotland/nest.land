import { colors } from "./lib/deps.ts";
import { UpdateNotifier, box } from "./lib/update.ts";

const onWindows = Deno.build.os === "windows";
const [execName, updateCheckInterval, ...args] = Deno.args;

if (!execName || !updateCheckInterval) {
  box(`${colors.red("Error")} incorrect number of arguments.`);
  Deno.exit(1);
}

let status: Deno.ProcessStatus;

try {
  const process = Deno.run({
    cmd: [
      execName + (onWindows ? ".cmd" : ""),
      ...args,
    ],
  });

  status = await process.status();
  process.close();
} catch {
  box(`${colors.red("Error")} ${execName} doesn't exist.`);
  Deno.exit(1);
}

const notifier = new UpdateNotifier(
  execName,
  Number.parseInt(updateCheckInterval),
);

await notifier.init();
await notifier.checkForUpdate();

Deno.exit(status.code);
