import { XConfig } from "./config";

import { JWKInterface } from "arweave/node/lib/wallet";
import Arweave from "arweave/node";
import pino from "pino";

const log = pino({ name: "arweave" });

let jwk = {} as JWKInterface;
let lastAnchor!: string;

export async function connectAr(config: XConfig) {
  const ar = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 20000,
    logging: !config.isProd,
    logger: log.debug,
  });

  jwk = config.jwk;

  await getAnchor(ar, true);

  return ar;
}

export async function getAnchor(ar: Arweave, regenerate = false) {
  if (regenerate || !lastAnchor) {
    const { data } = await ar.api.get("tx_anchor");
    return data as string;
  }

  return lastAnchor;
}

export async function get(ar: Arweave, id: string) {
  try {
    const transaction = await ar.transactions.getData(id, {
      decode: true,
      string: false,
    });

    if (!transaction) return;
    return typeof transaction === "string"
      ? (Buffer.from(transaction) as Uint8Array)
      : transaction;
  } catch {}
}

interface SaveOpts {
  name: string;
  type: string;
  data: Uint8Array;
}

export async function save(ar: Arweave, data: SaveOpts) {
  const transaction = await ar.createTransaction(
    { data: data.data, last_tx: await getAnchor(ar) },
    jwk,
  );

  transaction.addTag("Content-Type", data.type);

  await ar.transactions.sign(transaction, jwk);
  const res = await ar.transactions.post(transaction);

  if (res.status >= 300) throw new Error("Transaction failed");

  return transaction.id;
}
