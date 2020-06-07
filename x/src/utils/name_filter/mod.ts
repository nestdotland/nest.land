import { containsExpletive } from "./expletives.ts";
import { RESERVED } from "./reserved.ts";

export function isValidName(input: string) {
  if (containsExpletive(input)) return false;
  if (RESERVED.has(input)) return false;

  return true;
}

export default isValidName;
