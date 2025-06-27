export default {
  extends: "semantic-release-monorepo",
  branches: [
    "main",
    {
      name: "release-*",
      prerelease: false,
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
