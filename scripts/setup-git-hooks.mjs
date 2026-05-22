#!/usr/bin/env node
// Installs a pre-commit hook that regenerates diagram SVGs when .mmd files change.
// Runs automatically via the `prepare` lifecycle on `pnpm install`.
// No-op on CI checkouts where .git/hooks is absent (e.g. Netlify).
import { writeFileSync, chmodSync, existsSync } from "node:fs";
import path from "node:path";

const hooksDir = path.join(".git", "hooks");
if (!existsSync(hooksDir)) process.exit(0);

const hookPath = path.join(hooksDir, "pre-commit");
writeFileSync(
  hookPath,
  "#!/bin/sh\nexec node scripts/pre-commit-diagrams.mjs\n",
);
chmodSync(hookPath, 0o755);
console.log(`✓ Installed ${hookPath}`);
