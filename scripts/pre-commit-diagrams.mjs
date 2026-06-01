#!/usr/bin/env node
// Pre-commit hook: if any diagrams/*.mmd is staged, regenerate every SVG and
// stage the matching files under src/images/diagrams/.
import { execSync } from 'node:child_process';

function git(args) {
  return execSync(`git ${args}`, { encoding: 'utf8' }).trim();
}

const staged = git('diff --cached --name-only --diff-filter=ACMR').split('\n').filter(Boolean);

if (!staged.some((f) => f.startsWith('diagrams/') && f.endsWith('.mmd'))) {
  process.exit(0);
}

console.log('→ Staged .mmd changes detected, regenerating diagrams…');
execSync('node scripts/generate-diagrams.mjs', { stdio: 'inherit' });
execSync('git add src/images/diagrams', { stdio: 'inherit' });
