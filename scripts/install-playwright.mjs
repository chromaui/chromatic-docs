#!/usr/bin/env node
// Installs the headless Chromium shell that mermaid-isomorphic needs at build time.
// Wraps `playwright install` with a hard timeout because the install hangs after
// the visible download finishes on Netlify's Ubuntu 24.04 (noble-new-builds) image.
// The downloaded binary is what we actually need; if the process won't exit on its
// own, we kill it and let the build proceed.
import { spawn } from "node:child_process";

const TIMEOUT_MS = 5 * 60 * 1000;

const child = spawn("playwright", ["install", "chromium-headless-shell"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS: "1" },
});

const timer = setTimeout(() => {
  console.warn(
    `playwright install exceeded ${TIMEOUT_MS / 1000}s; killing and continuing.`,
  );
  child.kill("SIGKILL");
}, TIMEOUT_MS);

child.on("exit", () => {
  clearTimeout(timer);
  process.exit(0);
});
