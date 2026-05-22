#!/usr/bin/env node
// Installs a pre-commit hook that regenerates diagram SVGs when .mmd files change.
// Runs automatically via the `prepare` lifecycle on `pnpm install`.
import { writeFileSync, chmodSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";

// Don’t mutate .git during CI installs.
if (process.env.CI) process.exit(0);

const hooksDir = path.join(".git", "hooks");
if (!existsSync(hooksDir)) process.exit(0);

const hookPath = path.join(hooksDir, "pre-commit");
const contents = "#!/bin/sh\nexec node scripts/pre-commit-diagrams.mjs\n";

// Avoid clobbering existing hooks (husky/custom hooks/etc).
if (existsSync(hookPath)) {
  try {
    const existing = readFileSync(hookPath, "utf8");
    if (existing === contents) process.exit(0);
  } catch {
    // ignore read errors
  }
  console.warn(`Skipping install: ${hookPath} already exists`);
  process.exit(0);
}

writeFileSync(hookPath, contents);
chmodSync(hookPath, 0o755);
console.log(`✓ Installed ${hookPath}`);
