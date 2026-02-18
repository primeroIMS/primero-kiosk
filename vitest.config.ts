import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./app/frontend"),
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "app/frontend/tests/setup.ts",
        watch: false,
    },
});
