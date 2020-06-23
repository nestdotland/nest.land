export function normalise(input: string) {
  let copy = input.slice(0);

  copy = copy.toLowerCase();
  copy = copy.replace(/[-_.:]/g, "_");
  const hasInvalidCharacters = /[^a-z0-9_]/.test(copy);

  if (hasInvalidCharacters) return;
  return copy;
}
