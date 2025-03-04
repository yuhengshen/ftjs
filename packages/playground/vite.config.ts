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
            "@ftjs/core": path.resolve(__dirname, "../core/src/index.ts"),
            "@ftjs/antd": path.resolve(__dirname, "../antd/src/index.ts"),
          }
        : undefined,
    },
  };
});
