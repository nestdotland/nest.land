/**
 * Ensure you are running this test at the root of nest.land
 *
 * Requires: --allow-read, --allow-run, --allow-write
 */

import { assertEquals } from "../../src/deps.ts"

const pathToHere = "eggs/tests/commands/";

function replaceMainDepFileContent (filenameToReplace: string, replacedWithFilename: string): void {
  const replacerFilename = pathToHere + replacedWithFilename
  const replaceeFilename = pathToHere + filenameToReplace
  const replacerContent = new TextDecoder("utf-8").decode(Deno.readFileSync(replacerFilename));
  Deno.writeFileSync(replaceeFilename, new TextEncoder().encode(replacerContent))
}

function emptyDependencyFile (filename: string): void {
  Deno.writeFileSync(pathToHere + filename, new TextEncoder().encode(""))
}

function removeDependencyFile (filename: string): void {
  try {
    Deno.removeSync(pathToHere + filename)
  } catch (err) {

  }
}

Deno.test({
  name: "Commands | update | Fails when --deps Is Passed In But No Specified Dependencies",
  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "../../src/main.ts", "update", "--deps"],
      stdout: "piped",
      stderr: "piped",
      cwd: "eggs/tests/commands"
    });
    const status = await p.status();
    p.close();
    const stdout = new TextDecoder("utf-8").decode(await p.output());
    const stderr = new TextDecoder("utf-8").decode(await p.stderrOutput());
    assertEquals(stderr, "Provide dependencies to update when using --deps. Exiting...\n");
    assertEquals(stdout, "");
    assertEquals(status.code, 1);
    assertEquals(status.success, false);
    const originalDepContent = new TextDecoder("utf-8").decode(Deno.readFileSync(Deno.cwd() + "/eggs/tests/commands/original_deps.ts"));
    const newDepContent = new TextDecoder("utf-8").decode(Deno.readFileSync(Deno.cwd() + "/eggs/tests/commands/deps.ts"));
    assertEquals(originalDepContent === newDepContent, true)
  }
})


Deno.test({
  name: 'Commands | update | Passes When Updating All With --file Flag',
  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "../../src/main.ts", "update", "--file", "deps.ts"],
      stdout: "piped",
      stderr: "piped",
      cwd: "eggs/tests/commands"
    });
    const status = await p.status();
    p.close();
    const stdout = new TextDecoder("utf-8").decode(await p.output());
    const stderr = new TextDecoder("utf-8").decode(await p.stderrOutput());
    assertEquals(stderr, "");
    assertEquals(stdout, "Updated your dependencies!\n");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
    const originalDepContent = new TextDecoder("utf-8").decode(Deno.readFileSync(Deno.cwd() + "/eggs/tests/commands/original_deps.ts"));
    const newDepContent = new TextDecoder("utf-8").decode(Deno.readFileSync(Deno.cwd() + "/eggs/tests/commands/deps.ts"));
    assertEquals(originalDepContent !== newDepContent, true)
    replaceMainDepFileContent("deps.ts", "original_deps.ts")
  }
});

Deno.test({
  name: 'Commands | update | Passes When Defaulting to deps.ts with no --file flag',
  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "../../src/main.ts", "update"],
      stdout: "piped",
      stderr: "piped",
      cwd: "eggs/tests/commands"
    });
    const status = await p.status();
    p.close();
    const stdout = new TextDecoder("utf-8").decode(await p.output());
    const stderr = new TextDecoder("utf-8").decode(await p.stderrOutput());
    assertEquals(stderr, "");
    assertEquals(stdout, "Updated your dependencies!\n");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
    const originalDepContent = new TextDecoder("utf-8").decode(Deno.readFileSync(Deno.cwd() + "/eggs/tests/commands/original_deps.ts"));
    const newDepContent = new TextDecoder("utf-8").decode(Deno.readFileSync(Deno.cwd() + "/eggs/tests/commands/deps.ts"));
    assertEquals(originalDepContent !== newDepContent, true);
    assertEquals(newDepContent.indexOf("eggs@v0.1.16") > 0, true);
    assertEquals(newDepContent.indexOf("std@v0.56.0/fmt") > 0, true);
    assertEquals(newDepContent.indexOf("bcrypt@v0.2.1") > 0, true);
    replaceMainDepFileContent("deps.ts", "original_deps.ts")
  }
});

Deno.test({
  name: 'Commands | update | Fails If No Dependency File Found',
  //ignore: true,
  async fn(): Promise<void> {
    removeDependencyFile("deps.ts")
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "../../src/main.ts", "update", "--file", "dontexist.ts"],
      stdout: "piped",
      stderr: "piped",
      cwd: "eggs/tests/commands"
    });
    const status = await p.status();
    p.close();
    const stdout = new TextDecoder("utf-8").decode(await p.output());
    const stderr = new TextDecoder("utf-8").decode(await p.stderrOutput());
    assertEquals(stderr, "No dependency file was found in your current working directory. Exiting...\n");
    assertEquals(stdout, "");
    assertEquals(status.code, 1);
    assertEquals(status.success, false);
    replaceMainDepFileContent("deps.ts", "original_deps.ts")
  }
});

Deno.test({
  name: 'Commands | update | Exits If No Dependencies Found',
  //ignore: true,
  async fn(): Promise<void> {
    emptyDependencyFile("deps.ts")
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "../../src/main.ts", "update"],
      stdout: "piped",
      stderr: "piped",
      cwd: "eggs/tests/commands"
    });
    const status = await p.status();
    p.close();
    const stdout = new TextDecoder("utf-8").decode(await p.output());
    const stderr = new TextDecoder("utf-8").decode(await p.stderrOutput());
    assertEquals(stderr, "Your dependency file does not contain any imported modules. Exiting...\n");
    assertEquals(stdout, "");
    assertEquals(status.code, 1);
    assertEquals(status.success, false);
    replaceMainDepFileContent("deps.ts", "original_deps.ts")
  }
});


Deno.test({
  name: 'Commands | update | All | Does Nothing If Dependencies Are Up To Date',
  //ignore: true,
  async fn(): Promise<void> {
    replaceMainDepFileContent("deps.ts", "up_to_date_deps.ts")
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "../../src/main.ts", "update"],
      stdout: "piped",
      stderr: "piped",
      cwd: "eggs/tests/commands"
    });
    const status = await p.status();
    p.close();
    const stdout = new TextDecoder("utf-8").decode(await p.output());
    const stderr = new TextDecoder("utf-8").decode(await p.stderrOutput());
    assertEquals(stderr, "");
    assertEquals(stdout, "Your dependencies are already up to date!\n");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
    replaceMainDepFileContent("deps.ts", "original_deps.ts")
  }
});

Deno.test({
  name: 'Commands | update | Some | Does Nothing If Dependencies Are Up To Date',
  //ignore: true,
  async fn(): Promise<void> {
    replaceMainDepFileContent("deps.ts", "up_to_date_deps.ts");
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "../../src/main.ts", "update", "--deps", "http"],
      stdout: "piped",
      stderr: "piped",
      cwd: "eggs/tests/commands"
    });
    const status = await p.status();
    p.close();
    const stdout = new TextDecoder("utf-8").decode(await p.output());
    const stderr = new TextDecoder("utf-8").decode(await p.stderrOutput());
    assertEquals(stderr, "");
    assertEquals(stdout, "Your dependencies are already up to date!\n");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
    replaceMainDepFileContent("deps.ts", "original_deps.ts")
  }
});
