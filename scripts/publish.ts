import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const { version } = JSON.parse(
  readFileSync("package.json", { encoding: "utf8" }),
);

let command = "pnpm publish --access public --no-git-checks";

if (version.includes("beta")) command += " --tag beta";

execSync(command, { stdio: "inherit" });
