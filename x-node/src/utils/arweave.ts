import Arweave from "arweave/node";
import Credentials from "../../arweave-keyfile.json";

export type ArwConnection = Arweave;

export async function connect () {
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 20000,
    logging: process.env.NODE_ENV === "development",
    logger: (...e) => console.log(...e),
  });

  return arweave;
}

export async function save (connection: Arweave, data: { name: string, type: string, data: Buffer }) {
  const transaction = await connection.createTransaction({ data: data.data }, Credentials);
  transaction.addTag("X-Filename", data.name);
  transaction.addTag("Content-Type", data.type);

  await connection.transactions.sign(transaction, Credentials);
  const res = await connection.transactions.post(transaction);

  if (res.status >= 300) throw new Error("Transaction failed!");

  return `https://arweave.net/tx/${transaction.id}/data`;
}