import crypto from "crypto";

const ALGOS = {
  sha256: {
    keylen: 32,
  },
  sha384: {
    keylen: 48,
  },
  sha512: {
    keylen: 64,
  },
};

type AlgoKey = keyof typeof ALGOS;

const DEFAULT_SALT_LENGTH = 18;
const DEFAULT_ALGO: AlgoKey = "sha384";
const DEFAULT_ROUNDS = 12000;

interface PassData {
  salt: Buffer;
  hash: Buffer;
  algo: AlgoKey;
  rounds: number;
}

function split(hashed: string): PassData {
  const splitHash = hashed.split("$").slice(1, -1);
  const meta = splitHash[0].split(":");
  const [salt, hash] = splitHash[1]
    .split(":")
    .map((el) => Buffer.from(el, "base64"));

  const algo = meta[0] as AlgoKey;
  const rounds = parseInt(meta[1]);

  return {
    algo,
    rounds,
    salt,
    hash,
  };
}

function join({ salt, hash, algo, rounds }: PassData) {
  const meta = `${algo}:${rounds}`;
  const data = `${salt.toString("base64")}:${hash.toString("base64")}`;
  return `$${meta}$${data}$`;
}

export function hash(password: string): Promise<string> {
  return new Promise((res, rej) => {
    const salt = crypto.randomBytes(DEFAULT_SALT_LENGTH);
    const algo = DEFAULT_ALGO;
    const rounds = DEFAULT_ROUNDS;
    const keylen: number = ALGOS[algo].keylen;

    return crypto.pbkdf2(password, salt, rounds, keylen, algo, (err, hash) => {
      if (err) return rej(err);
      return res(
        join({
          algo,
          rounds,
          salt,
          hash,
        }),
      );
    });
  });
}

export function verify(password: string, hashed: string): Promise<boolean> {
  return new Promise((res, rej) => {
    const { algo, rounds, salt, hash } = split(hashed);
    const keylen: number = ALGOS[algo].keylen;

    return crypto.pbkdf2(
      password,
      salt,
      rounds,
      keylen,
      algo,
      (err, computedHash) => {
        if (err) return rej(err);
        return res(crypto.timingSafeEqual(hash, computedHash));
      },
    );
  });
}
