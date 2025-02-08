import { defineConfig } from "vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [vueJsx(), dts({
    exclude: ['vite.config.ts']
  })],
  build: {
    emptyOutDir: true,
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ['ant-design-vue', 'vue', '@tf/core']
    },
  },
});
