#!/usr/bin/env node
// Verifies committed diagram SVGs are in sync with their `.mmd` sources using
// the manifest hashes — no Kroki/network required. See diagrams-manifest.mjs.
import { findDrift } from './diagrams-manifest.mjs';

const problems = await findDrift();
if (problems.length === 0) {
  console.log('✓ Diagrams are in sync with their sources.');
  process.exit(0);
}

console.error('✗ Diagram sources and committed SVGs are out of sync:\n');
for (const p of problems) console.error(`  • ${p}`);
console.error("\nRun 'pnpm diagrams' locally and commit the updated SVGs and manifest.");
process.exit(1);
