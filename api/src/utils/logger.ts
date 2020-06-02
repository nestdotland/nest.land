import {
  gray,
  cyan,
  yellow,
  red,
  green,
  magenta,
  bold,
} from "../deps.ts";

const METHOD_COLOURS = {
  debug: gray,
  info: cyan,
  warn: yellow,
  error: red,
};

type LevelNames = keyof typeof METHOD_COLOURS;
type LoggerMethods = Record<LevelNames, typeof console.log>;

interface Logger extends LoggerMethods {
  child(name: string): Logger;
}

let defaultName = "";

export function setDefaultName(newDefaultName: string) {
  defaultName = newDefaultName;
}

// Add these overloads so that the child creation function isn't usually visible.
export function createLogger(name?: string): Logger;
export function createLogger(name: string, childNames: string[]): Logger;
export function createLogger(name = defaultName, childNames?: string[]) {
  const knownChildNames = childNames ?? [];
  if (name === "" && knownChildNames.length) name = knownChildNames.pop() ?? "";
  const debugEnabled = !!Deno.env.get("DEBUG");
  const displayName = [name, ...knownChildNames].map(green).join(gray(" > "));

  const loggerObj = (Object.fromEntries(
    Object.entries(METHOD_COLOURS).map(([key, colouriser]) => [
      key,
      (...args: unknown[]) => {
        let callableKey = key === "warn" ? "info" : key;
        if (callableKey === "debug" && !debugEnabled) return;
        console[callableKey as "log"](
          formatLog(displayName, { method: key, colouriser }),
          ...args,
        );
      },
    ]),
  ) as unknown) as Logger;

  loggerObj.child = (childName: string) =>
    createLogger(name, [childName, ...knownChildNames]);

  return loggerObj;
}

export function createChild(childName: string) {
  return createLogger(defaultName, [childName]);
}

function formatLog(
  displayName: string,
  opts: { method: string; colouriser: typeof gray; },
) {
  if (displayName.length > 11) displayName += " ";
  const currentTime = new Date();
  const timeStr = currentTime.toLocaleTimeString();
  return `${
    bold(
      magenta(timeStr.slice(0, timeStr.indexOf(" "))),
    )
    } ${displayName}${opts.colouriser(opts.method)}`;
}