import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import process from "node:process";

const { version: oldVersion, name: _name } = JSON.parse(
  readFileSync("package.json", { encoding: "utf8" }),
);

execSync("pnpm exec bumpp --no-commit --no-tag --no-push", {
  stdio: "inherit",
});

const { version } = JSON.parse(
  readFileSync("package.json", { encoding: "utf8" }),
);

if (oldVersion === version) {
  console.log("canceled");
  process.exit();
}

execSync("pnpm run build", { stdio: "inherit" });
execSync("git add .", { stdio: "inherit" });

const name = (_name as string).replace("/", "-");

const str = `${name}v${version}`;

execSync(`git commit -m "chore: release ${str}"`, {
  stdio: "inherit",
});

execSync(`git tag -a ${str} -m "${str}"`, {
  stdio: "inherit",
});
