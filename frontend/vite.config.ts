import { screenGraphPlugin } from "@animaapp/vite-plugin-screen-graph";
import react from "@vitejs/plugin-react";
import { defineConfig, PluginOption } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "development" ? screenGraphPlugin() as PluginOption : null
  ].filter(Boolean) as PluginOption[],
  publicDir: "public",
  base: "./",
}));
