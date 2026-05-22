#!/usr/bin/env node
// Installs a pre-commit hook that regenerates diagram SVGs when .mmd files change.
// Runs automatically via the `prepare` lifecycle on `pnpm install`.
import { writeFileSync, chmodSync, existsSync } from "node:fs";
import path from "node:path";

if (!existsSync(".git")) process.exit(0); // not a git checkout (e.g. CI cache build)

const hookPath = path.join(".git", "hooks", "pre-commit");
writeFileSync(
  hookPath,
  "#!/bin/sh\nexec node scripts/pre-commit-diagrams.mjs\n",
);
chmodSync(hookPath, 0o755);
console.log(`✓ Installed ${hookPath}`);
