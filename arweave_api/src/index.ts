import Arweave from "arweave/node";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import jwk from "./arweave.json";

const arweave = Arweave.init({
  host: "127.0.0.1",
  port: 1984,
  protocol: "http",
});

const server = new Koa();
let address: string;

server.use(bodyParser());

server.use(async ctx => {
  const transaction = await arweave.createTransaction(
    { data: ctx.request.body },
    jwk,
  );

  transaction.addTag("Content-Type", "application/typescript");

  await arweave.transactions.sign(transaction, jwk);
  const res = await arweave.transactions.post(transaction);

  if (res.status >= 300) return ctx.throw(500);

  ctx.body = `http://127.0.0.1:1984/tx/${transaction.id}/data`;
});

async function bootstrap() {
  address = await arweave.wallets.jwkToAddress(jwk);
  server.listen(8082);
}

bootstrap();
