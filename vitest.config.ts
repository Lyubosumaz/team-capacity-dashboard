import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      thresholds: {
        lines: 10,
        branches: 10,
        functions: 10,
        statements: 10,
      },
      exclude: [
        "**/node_modules/**",
        "**/.next/**",
        "**/cypress/**",
        "**/*.test.*",
        "**/*.spec.*",
      ],
    },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
