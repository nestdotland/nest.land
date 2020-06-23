import { Router } from "express";
import { generateToken } from "../utils/token";
import { hash, verify } from "../utils/password";
import { DBConn } from "../utils/driver";
import { User } from "../utils/entities/User";
import { normaliseName } from "../utils/normalise";

interface GenericAuthBody {
  username: string;
  password: string;
}

interface NewPasswordBody {
  username: string;
  password: string;
  newPassword: string;
}

export function authRouter(dbConn: DBConn) {
  const router = Router();

  router.post("/signup", async (req, res) => {
    const { username, password } = req.body as GenericAuthBody;

    // Ensure the body satisfies the correct shape.
    if (!username || !password) return res.sendStatus(400);
    if (typeof username !== "string" || typeof password !== "string") {
      return res.sendStatus(400);
    }

    if (username.length > 20 || username.length < 3) return res.sendStatus(400);

    const normalisedName = normaliseName(username);
    if (!normalisedName) return res.sendStatus(400);

    const existingUser = !!(await dbConn.repos.user.findOne({
      where: { normalizedName: normalisedName },
    }));

    if (existingUser) return res.sendStatus(409);

    const user = new User();
    user.name = username;
    user.normalizedName = normalisedName;
    user.password = await hash(password);
    user.apiKey = generateToken();
    user.packageNames = [];

    await dbConn.repos.user.insert(user);

    return res.status(201).send({
      success: true,
      name: username,
      apiKey: user.apiKey,
    });
  });

  router.post("/newpassword", async (req, res) => {
    const { username, password, newPassword } = req.body as NewPasswordBody;

    // Validate the payload.
    if (!username || !password || !newPassword) return res.sendStatus(400);
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof newPassword !== "string"
    ) {
      return res.sendStatus(400);
    }

    if (username.length > 20) return res.sendStatus(400);

    const user = await dbConn.repos.user.findOne({
      where: { name: username },
    });

    if (!user) return res.sendStatus(404);

    const passwordMatch = await verify(password, user.password);
    if (!passwordMatch) return res.sendStatus(401);

    const newPasswordHash = await hash(newPassword);

    await dbConn.repos.user.update(
      { name: user.name },
      { password: newPasswordHash },
    );

    return res.status(200).send({
      success: true,
      name: username,
    });
  });

  router.post("/getkey", async (req, res) => {
    const { username, password } = req.body as GenericAuthBody;

    // Validate body.
    if (!username || !password) return res.sendStatus(400);
    if (username.length > 20) return res.sendStatus(400);

    const user = await dbConn.repos.user.findOne({
      where: { name: username },
    });

    if (!user) return res.sendStatus(404);

    const passwordMatch = await verify(password, user.password);
    if (!passwordMatch) return res.sendStatus(401);

    return res.status(200).send({
      success: true,
      name: username,
      apiKey: user.apiKey,
    });
  });

  router.post("/newkey", async (req, res) => {
    const { username, password }: GenericAuthBody = req.body;
    if (!username || !password) return res.sendStatus(400);

    if (username.length > 20) return res.sendStatus(400);

    const user = await dbConn.repos.user.findOne({
      where: { name: username },
    });

    if (!user) return res.sendStatus(404);

    const passwordMatch = await verify(password, user.password);
    if (!passwordMatch) return res.sendStatus(401);

    const newApiKey = generateToken();

    await dbConn.repos.user.update({ name: user.name }, { apiKey: newApiKey });

    return res.status(200).send({
      success: true,
      name: username,
      apiKey: newApiKey,
    });
  });

  return router;
}
