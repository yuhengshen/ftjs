export default {
  extends: "semantic-release-monorepo",
  branches: [
    "main",
    "master",
    {
      name: "semantic-release-monorepo",
      prerelease: "beta",
    },
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    [
      "@semantic-release/github",
      {
        assets: ["dist/**/*"],
      },
    ],
  ],
};
