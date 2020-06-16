import { join } from "path";
import { constants } from "fs";
import {
  access,
  mkdir,
  readFile,
  unlink,
  stat,
  readdir,
  writeFile,
} from "fs/promises";

export async function exists(path: string) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function initTemp(time = 60, age = 1800) {
  if (!(await exists("./.tmp"))) await mkdir("./.tmp");

  setInterval(checkTempFiles, time * 1000);
  checkTempFiles();

  async function checkTempFiles() {
    const tempFileNames = await readdir("./.tmp");

    tempFileNames.forEach(async (fileName) => {
      const filePath = join("./.tmp", fileName);
      const stats = await stat(filePath);

      const fileLifeExceeded = Date.now() - stats.mtimeMs > age * 1000;
      if (fileLifeExceeded) await unlink(filePath);
    });
  }
}

export function saveTempFile(id: string, data: Buffer) {
  return writeFile(join("./.tmp", id), data);
}

export async function getTimeFile(id: string) {
  const filePath = join("./.tmp", id);
  if (await exists(filePath)) return await readFile(filePath);
}

export function has(id: string) {
  const filePath = join("./.tmp", id);
  return exists(filePath);
}
