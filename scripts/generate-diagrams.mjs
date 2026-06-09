#!/usr/bin/env node
// Renders every diagrams/*.mmd to src/images/diagrams/*.svg by POSTing the
// mermaid source to Kroki. Run with `--watch` to regenerate on save.
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC_DIR = path.join(ROOT, 'diagrams');
const OUT_DIR = path.join(ROOT, 'src/images/diagrams');
const KROKI = process.env.KROKI_URL ?? 'https://kroki.io';
const KROKI_RETRIES = Number(process.env.KROKI_RETRIES ?? 3);
const KROKI_RETRY_DELAY_MS = Number(process.env.KROKI_RETRY_DELAY_MS ?? 1000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const shouldRetryStatus = (status) => status === 429 || status >= 500;

async function render(file) {
  const src = await readFile(path.join(SRC_DIR, file), 'utf8');
  let lastError;
  for (let attempt = 1; attempt <= KROKI_RETRIES; attempt++) {
    try {
      const res = await fetch(`${KROKI}/mermaid/svg`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: src,
      });
      if (res.ok) {
        const svg = await res.text();
        const out = path.join(OUT_DIR, file.replace(/\.mmd$/, '.svg'));
        await writeFile(out, svg);
        return out;
      }

      const body = await res.text();
      const error = new Error(`Kroki ${res.status} for ${file}: ${body}`);
      error.retriable = shouldRetryStatus(res.status);
      lastError = error;
      if (!error.retriable || attempt === KROKI_RETRIES) {
        throw lastError;
      }
    } catch (error) {
      lastError = error;
      if (!error.retriable || attempt === KROKI_RETRIES) {
        throw lastError;
      }
    }

    await sleep(KROKI_RETRY_DELAY_MS * attempt);
  }

  throw lastError;
}

async function renderAll() {
  await mkdir(OUT_DIR, { recursive: true });
  const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith('.mmd'));
  if (files.length === 0) {
    console.log('No .mmd files in diagrams/');
    return;
  }
  const results = await Promise.allSettled(files.map(render));
  let failed = 0;
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      console.log(`✓ ${files[i]} → ${path.relative(ROOT, r.value)}`);
    } else {
      failed++;
      console.error(`✗ ${files[i]}: ${r.reason.message}`);
    }
  });
  if (failed > 0) process.exit(1);
}

async function renderOne(file) {
  try {
    const out = await render(file);
    console.log(`✓ ${file} → ${path.relative(ROOT, out)}`);
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
  }
}

async function main() {
  if (process.argv.includes('--watch')) {
    await mkdir(OUT_DIR, { recursive: true });
    await renderAll();
    console.log(`\nWatching ${path.relative(ROOT, SRC_DIR)} for changes…`);
    const debounce = new Map();
    watch(SRC_DIR, (_, filename) => {
      if (!filename || !filename.endsWith('.mmd')) return;
      clearTimeout(debounce.get(filename));
      debounce.set(
        filename,
        setTimeout(async () => {
          try {
            await stat(path.join(SRC_DIR, filename));
            await renderOne(filename);
          } catch {
            // file deleted; ignore
          }
        }, 100)
      );
    });
  } else {
    await renderAll();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
