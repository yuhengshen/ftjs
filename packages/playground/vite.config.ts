import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(env => {
  const isDev = env.mode === "development";

  return {
    plugins: [vue(), vueJsx()],
    base: "/",
    resolve: {
      alias: isDev
        ? {
            "@tf/core": path.resolve(__dirname, "../tf-core/src/index.ts"),
            "@tf/antd": path.resolve(__dirname, "../tf-antd/src/index.ts"),
          }
        : undefined,
    },
  };
});
