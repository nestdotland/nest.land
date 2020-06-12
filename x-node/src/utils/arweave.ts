import Arweave from "arweave/node";
import Credentials from "../../arweave-keyfile.json";

export type ArwConnection = Arweave & { anchor: string };

export async function connect () {
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 20000,
    logging: process.env.NODE_ENV === "development",
    logger: (...e) => console.log(...e),
  });

  (arweave as any).anchor = (await arweave.api.get("tx_anchor")).data;

  return arweave as ArwConnection;
}

export async function regenerateAnchor (arweave: ArwConnection) {
  (arweave as any).anchor = (await arweave.api.get("tx_anchor")).data;
  return arweave;
}

export async function get (connection: ArwConnection, id: string): Promise<Uint8Array | null> {
  try {
    let transaction = await connection.transactions.getData(id, { decode: true, string: false });
    if (!transaction) return null;
    return Buffer.from(transaction);
  } catch (err) {
    return null;
  }
}

export async function save (connection: ArwConnection, data: { name: string, type: string, data: Buffer }) {
  const transaction = await connection.createTransaction({ data: data.data, last_tx: connection.anchor }, Credentials);
  transaction.addTag("Content-Type", data.type);

  await connection.transactions.sign(transaction, Credentials);
  const res = await connection.transactions.post(transaction);

  if (res.status >= 300) throw new Error("Transaction failed!");

  return transaction.id;
}