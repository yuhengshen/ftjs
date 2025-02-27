import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const oldPkg = JSON.parse(readFileSync("package.json", { encoding: "utf-8" }));

execSync("pnpm exec bumpp -r --no-commit --no-push --no-tag", {
  stdio: "inherit",
});
const pkg = JSON.parse(readFileSync("package.json", { encoding: "utf-8" }));

if (oldPkg.version === pkg.version) {
  console.log("Version is not updated");
  process.exit(1);
}

execSync("pnpm run build", { stdio: "inherit" });
execSync("git add .", { stdio: "inherit" });

execSync(`git commit -m "chore: release v${pkg.version}"`, {
  stdio: "inherit",
});

execSync(`git tag -a v${pkg.version} -m "Release version ${pkg.version}"`, {
  stdio: "inherit",
});
