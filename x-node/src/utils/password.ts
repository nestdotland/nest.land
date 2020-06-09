import crypto from "crypto";

function split (hashed: string) {
  let splitHash = hashed.split("$").slice(1, -1);
  let meta = splitHash[0].split(":");
  let [ salt, hash ] = splitHash[1].split(":").map(el => Buffer.from(el, "base64"));

  let algo = meta[0];
  let rounds = parseInt(meta[1]);

  return {
    algo,
    rounds,

    salt,
    hash,
  };
}

function join ({ salt, hash, algo, rounds }: { salt: Buffer, hash: Buffer, algo: string, rounds: number }) {
  let meta = `${algo}:${rounds}`;
  let data = `${salt.toString("base64")}:${hash.toString("base64")}`;
  return `$${meta}$${data}$`;
}

const ALGOS = {
  "sha256": {
    keylen: 32
  },
  "sha384": {
    keylen: 48
  },
  "sha512": {
    keylen: 64
  },
};

const DEFAULT_SALT_LENGTH = 18;
const DEFAULT_ALGO = "sha384";
const DEFAULT_ROUNDS = 12000;

export function hash (password: string): Promise<string> {
  return new Promise((res, rej) => {
    let salt = crypto.randomBytes(DEFAULT_SALT_LENGTH);
    let algo = DEFAULT_ALGO;
    let rounds = DEFAULT_ROUNDS;
    let keylen: number = ALGOS[algo].keylen;

    return crypto.pbkdf2(password, salt, rounds, keylen, algo, (err, hash) => {
      if (err) return rej(err);
      return res(join({
        algo,
        rounds,
        salt,
        hash
      }));
    });
  });
}

export function verify (password: string, hashed: string): Promise<boolean> {
  return new Promise((res, rej) => {
    let { algo, rounds, salt, hash } = split(hashed);
    let keylen: number = ALGOS[algo].keylen;

    return crypto.pbkdf2(password, salt, rounds, keylen, algo, (err, computedHash) => {
      if (err) return rej(err);
      return res(crypto.timingSafeEqual(hash, computedHash));
    });
  });
}