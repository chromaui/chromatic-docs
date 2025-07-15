/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "src/**/*.test.{ts,tsx,js,mjs}",
      "chromatic-config/**/*.test.{ts,js}",
    ],
  },
});
