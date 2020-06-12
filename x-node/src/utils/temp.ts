import fs from "fs";
import path from "path";

export function init (time = 60, age = 1800) {
  if (!fs.existsSync("./.tmp")) fs.mkdirSync("./.tmp");

  const _timeout = () => {
    fs.readdirSync("./.tmp").map(el => {
      let f = path.join("./.tmp", el);
      let stats = fs.statSync(f);

      if (Date.now() - stats.mtimeMs > age * 1000) return fs.unlinkSync(f);
    });
  };

  setTimeout(_timeout, time * 1000);
  _timeout();
}

export function save (id: string, data: Buffer) {
  fs.writeFileSync(path.join("./.tmp", id), data);
}

export function get (id: string) {
  let f = path.join("./.tmp", id);
  if (fs.existsSync(f)) {
    return fs.readFileSync(f);
  } else return null;
}

export function has (id: string) {
  let f = path.join("./.tmp", id);
  return fs.existsSync(f);
}