import { defineConfig } from "vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dts from "vite-plugin-dts";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      exclude: ["vite.config.ts"],
    }),
  ],
  build: {
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["vue", "@ftjs/core", "dayjs", "element-plus"],
    },
  },
});
