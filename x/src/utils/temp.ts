import { promises, constants } from "fs";
import { join } from "path";

const { mkdir, readFile, access, unlink, stat, readdir, writeFile } = promises;

export async function init(time = 60, age = 1800) {
  if (!(await exists("./.tmp"))) await mkdir("./.tmp");

  const _interval = async () => {
    (await readdir("./.tmp")).forEach(async (el) => {
      const f = join("./.tmp", el);
      const stats = await stat(f);

      if (Date.now() - stats.mtimeMs > age * 1000) return await unlink(f);
    });
  };

  setInterval(_interval, time * 1000);
  _interval();
}

export function save(id: string, data: Buffer) {
  return writeFile(join("./.tmp", id), data);
}

export async function get(id: string) {
  const f = join("./.tmp", id);
  if (await exists(f)) {
    return await readFile(f);
  } else return null;
}

export function has(id: string) {
  const f = join("./.tmp", id);
  return exists(f);
}

async function exists(path: string) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
