const fs = require("fs"),
  commitMessage = fs.readFileSync(process.env.GIT_PARAMS, "utf-8"),
  validCommitRegex = /(feat|fix|remove|refactor|chore|release)\((.+)\)(: )(.{1,50})/;

if (validCommitRegex.test(commitMessage)) {
  console.log(
    "\x1b[2m" +
      "[" +
      "\x1b[0m" +
      "\x1b[32m" +
      "Verto" +
      "\x1b[0m" +
      "\x1b[2m" +
      "]" +
      "\x1b[0m",
    "\x1b[32m" + "Valid commit message" + "\x1b[0m"
  );
} else {
  console.log(
    "\x1b[2m" +
      "[" +
      "\x1b[0m" +
      "\x1b[32m" +
      "Verto" +
      "\x1b[0m" +
      "\x1b[2m" +
      "]" +
      "\x1b[0m",
    "\x1b[31m" +
      "Invalid commit message. You can commit like this:\n" +
      "\x1b[0m" +
      "\x1b[2m" +
      "feat(airplane): Add option to fly" +
      "\x1b[0m"
  );
  console.log(
    "\x1b[2m" +
      "[" +
      "\x1b[0m" +
      "\x1b[32m" +
      "Verto" +
      "\x1b[0m" +
      "\x1b[2m" +
      "]" +
      "\x1b[0m",
    "See all of the allowed formats in .github/commits-style.md"
  );
  process.exit(1);
}
