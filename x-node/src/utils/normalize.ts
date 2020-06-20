export default function transformName (input: string) {
  let copy = input.slice(0);

  copy = copy.toLowerCase();
  copy = copy.replace(/[-_.:]/g, "_");
  let hasInvalidCharacters = /[^a-z0-9_]/.test(copy);

  if (hasInvalidCharacters) return false;
  return copy;
}