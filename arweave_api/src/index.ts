import Arweave from "arweave/node";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import jwk from "./arweave.json";

// Credits: https://github.com/ArweaveTeam/arweave-deploy/blob/master/src/app.ts#L25
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
  logger: console.debug,
});

const server = new Koa();
let address: string;

server.use(bodyParser());

server.use((ctx, next) => {
  if (ctx.method === "POST") return next();
  ctx.body = "Pong!";
})

server.use(async ctx => {
  const transaction = await arweave.createTransaction(
    { data: ctx.request.body },
    jwk,
  );

  transaction.addTag("Content-Type", "application/typescript");

  await arweave.transactions.sign(transaction, jwk);
  const res = await arweave.transactions.post(transaction);

  if (res.status >= 300) return ctx.throw(500);

  ctx.body = `https://arweave.net/tx/${transaction.id}/data`;
});

async function bootstrap() {
  address = await arweave.wallets.jwkToAddress(jwk);
  server.listen(8081);
}

bootstrap();
