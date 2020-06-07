import expletives from "./expletives.ts";
import exact from "./exact.ts";
import reserved from "./reserved.ts";

export function isValidName (input: string) {
  return !expletives.test(input) && !exact.has(input) && !reserved.has(input);
}

export default isValidName;