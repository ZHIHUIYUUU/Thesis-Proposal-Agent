import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const indexHtml = fileURLToPath(new URL("./index.html", import.meta.url));

export default defineConfig({
  root: rootDir,
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: indexHtml,
    },
  },
});
