import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
      tanstackRouter({
        autoCodeSplitting: true,
        generatedRouteTree: "./_routes.gen.ts",
        routeFileIgnorePattern: "components|lib",
        routesDirectory: "routes",
        target: "react",
      }),
    tsconfigPaths(),
    react(),
    RubyPlugin(),
  ],
  resolve: {
      alias: {
        "@": path.resolve(__dirname, "./app/frontend"),
      },
  },
})
