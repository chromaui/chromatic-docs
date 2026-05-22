#!/usr/bin/env node
// Renders every diagrams/*.mmd to src/images/diagrams/*.svg by POSTing the
// mermaid source to Kroki. Run with `--watch` to regenerate on save.
import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { watch } from "node:fs";
import path from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC_DIR = path.join(ROOT, "diagrams");
const OUT_DIR = path.join(ROOT, "src/images/diagrams");
const KROKI = process.env.KROKI_URL ?? "https://kroki.io";

async function render(file) {
  const src = await readFile(path.join(SRC_DIR, file), "utf8");
  const res = await fetch(`${KROKI}/mermaid/svg`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: src,
  });
  if (!res.ok) {
    throw new Error(`Kroki ${res.status} for ${file}: ${await res.text()}`);
  }
  const svg = await res.text();
  const out = path.join(OUT_DIR, file.replace(/\.mmd$/, ".svg"));
  await writeFile(out, svg);
  return out;
}

async function renderAll() {
  await mkdir(OUT_DIR, { recursive: true });
  const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith(".mmd"));
  if (files.length === 0) {
    console.log("No .mmd files in diagrams/");
    return;
  }
  const results = await Promise.allSettled(files.map(render));
  let failed = 0;
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
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
  if (process.argv.includes("--watch")) {
    await mkdir(OUT_DIR, { recursive: true });
    await renderAll();
    console.log(`\nWatching ${path.relative(ROOT, SRC_DIR)} for changes…`);
    const debounce = new Map();
    watch(SRC_DIR, (_, filename) => {
      if (!filename || !filename.endsWith(".mmd")) return;
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
        }, 100),
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
