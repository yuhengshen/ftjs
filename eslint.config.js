import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      "prefer-const": ["error", { destructuring: "all" }],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      // _ 开头变量不检查
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          typeParameters: { ignorePatternsForAllParameters: true },
        },
      ],
    },
  },
  eslintConfigPrettier,
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/build/**"],
  },
);
