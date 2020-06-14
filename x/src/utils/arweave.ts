import Arweave from "arweave/node";

// @ts-expect-error
import jwk from "../../arweave-keyfile.json";
import { isDev } from "./util";

export type ArConn = Arweave & { anchor: string };

export async function connect() {
  const conn = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 20000,
    logging: isDev,
    logger: (...args: any[]) => console.log(...args),
  }) as ArConn;

  conn.anchor = await regenerateAnchor(conn);

  return conn;
}

export async function regenerateAnchor(conn: ArConn) {
  const { data } = await conn.api.get("tx_anchor");
  return data as string;
}

export async function get(conn: ArConn, id: string) {
  try {
    const transaction = await conn.transactions.getData(id, {
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

export async function save(conn: ArConn, data: SaveOpts) {
  const transaction = await conn.createTransaction(
    { data: data.data, last_tx: conn.anchor },
    jwk,
  );

  transaction.addTag("Content-Type", data.type);

  await conn.transactions.sign(transaction, jwk);
  const res = await conn.transactions.post(transaction);

  if (res.status >= 300) throw new Error("Transaction failed!");

  return transaction.id;
}
