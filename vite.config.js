import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        pedidos: resolve(__dirname, "pedidos.html"),
        dashlive: resolve(__dirname, "DASHLIVE.html"),
      },
    },
  },
});