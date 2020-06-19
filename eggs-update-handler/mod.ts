const oneDay = 1000 * 60 * 60 * 24;

/** Install update handler cli to check for updates and notify user */
export async function installUpdateHandler(
  moduleName: string,
  execName: string,
  updateCheckInterval: number = oneDay,
) {
  const installation = Deno.run({
    cmd: [
      "deno",
      "install",
      "--unstable",
      "-f",
      "-A",
      "-n",
      moduleName,
      "https://x.nest.land/eggs-update-handler@0.3.1/cli.ts",
      execName,
      updateCheckInterval.toString(),
    ],
    stderr: "null",
    stdout: "null",
  });

  const status = await installation.status();
  installation.close();

  if (status.success === false || status.code !== 0) {
    console.error("Update handler installation failed.");
    throw new Error("Update handler installation failed.")
  }
}
