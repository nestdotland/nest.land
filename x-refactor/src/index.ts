import "reflect-metadata";
import register from "module-alias/register";

import { bootstrap } from "./bootstrap";

// Register the aliases, such as @utils.
register();

// Bootstrap X.
bootstrap();
