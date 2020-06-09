import crypto from "crypto";
import { Router } from "express";
import { hash, verify } from "../utils/password";
import { User, DbConnection } from "../utils/driver";

export default (database: DbConnection) => {
  const router = Router();

  router.post("/signup", async (req, res) => {
    let { username, password }: { username: string, password: string } = req.body;
    if (!username || !password) return res.sendStatus(400);

    if (username.length > 20) return res.sendStatus(400);
    if (await database.repositories.User.findOne({ where: { name: username } })) return res.sendStatus(409);

    let user = new User();
    user.name = username;
    user.password = await hash(password);
    user.apiKey = crypto.randomBytes(24).toString("base64");
    user.packageNames = [];

    database.repositories.User.insert(user);

    return res.status(201).send({
      name: username,
      apiKey: user.apiKey,
    });
  });

  router.post("/getkey", async (req, res) => {
    const { username, password }: { username: string, password: string } = req.body;
    if (!username || !password) return res.sendStatus(400);

    if (username.length > 20) return res.sendStatus(400);

    let dbUser = await database.repositories.User.findOne({ where: { name: username } });
    if (!dbUser) return res.sendStatus(404);

    let passwordMatch = await verify(password, dbUser.password);
    if (!passwordMatch) return res.sendStatus(401);

    return res.status(200).send({
      name: username,
      apiKey: dbUser.apiKey,
    });
  });

  return router;
};