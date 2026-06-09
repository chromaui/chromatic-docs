// Shared helpers for the diagram-sync manifest.
//
// The manifest records, per diagram, the hash of the `.mmd` source and the
// hash of the rendered `.svg` output. `pnpm diagrams` rewrites it after a
// successful render; `verify-diagrams.mjs` recomputes the hashes and checks
// for drift WITHOUT contacting Kroki. This catches the common failure mode —
// editing a `.mmd` (or regenerating an `.svg`) without committing the matching
// counterpart — but does not verify the SVG is the correct render of its
// source (that still requires actually rendering).
import { readFile, writeFile, readdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC_DIR = path.join(ROOT, 'diagrams');
const OUT_DIR = path.join(ROOT, 'src/images/diagrams');
export const MANIFEST_PATH = path.join(OUT_DIR, 'diagrams.lock.json');

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const svgNameFor = (mmd) => mmd.replace(/\.mmd$/, '.svg');

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function listSources() {
  return (await readdir(SRC_DIR)).filter((f) => f.endsWith('.mmd')).sort();
}

// Build the manifest entries for the current on-disk state. Missing SVGs get a
// null svg hash so verification can report them rather than throwing.
export async function computeManifest() {
  const files = await listSources();
  const manifest = {};
  for (const file of files) {
    const src = await readFile(path.join(SRC_DIR, file));
    const svgPath = path.join(OUT_DIR, svgNameFor(file));
    manifest[file] = {
      src: sha256(src),
      svg: (await exists(svgPath)) ? sha256(await readFile(svgPath)) : null,
    };
  }
  return manifest;
}

export async function writeManifest(manifest) {
  const data = manifest ?? (await computeManifest());
  await writeFile(MANIFEST_PATH, JSON.stringify(data, null, 2) + '\n');
  return MANIFEST_PATH;
}

export async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  } catch {
    return null;
  }
}

// Compare the committed manifest against the current on-disk hashes.
// Returns an array of human-readable problem strings (empty = in sync).
export async function findDrift() {
  const recorded = await readManifest();
  if (!recorded) {
    return [`Manifest missing: ${path.relative(ROOT, MANIFEST_PATH)} — run 'pnpm diagrams'.`];
  }
  const current = await computeManifest();
  const problems = [];

  for (const [file, cur] of Object.entries(current)) {
    const rec = recorded[file];
    if (!rec) {
      problems.push(`${file}: new diagram not in manifest — run 'pnpm diagrams'.`);
      continue;
    }
    if (cur.svg === null) {
      problems.push(`${svgNameFor(file)}: rendered SVG is missing — run 'pnpm diagrams'.`);
    } else if (cur.svg !== rec.svg) {
      problems.push(
        `${svgNameFor(file)}: committed SVG differs from manifest — run 'pnpm diagrams'.`
      );
    }
    if (cur.src !== rec.src) {
      problems.push(`${file}: source changed since last render — run 'pnpm diagrams'.`);
    }
  }
  for (const file of Object.keys(recorded)) {
    if (!current[file]) {
      problems.push(`${file}: in manifest but no longer in diagrams/ — run 'pnpm diagrams'.`);
    }
  }
  return problems;
}
