import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "ra-strapi": path.resolve(__dirname, "../ra-strapi/src"),
    },
  },
  server: {
    host: true,
    port: 8080,
  },
  build: {
    sourcemap: mode === "developement",
  },
  base: "./",
}));
