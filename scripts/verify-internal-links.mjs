#!/usr/bin/env node
// @ts-check
/**
 * verify-internal-links.mjs
 *
 * Deterministic internal-link + anchor checker for the Chromatic docs.
 *
 * Why this exists: `pnpm check-links` runs `blc` against the PRODUCTION site, so
 * it cannot catch a broken link in an unmerged edit. This script resolves links
 * against the LOCAL build output, so the answer Claude just wrote can be verified
 * before it is committed.
 *
 * Ground truth is `dist/` (the real Astro build), NOT a re-implementation of
 * Astro's slug rules — which are not uniform (e.g. `ci/ci.mdx` → /docs/ci, but
 * `playwright/configure.mdx` → /docs/playwright/configure). Each built page also
 * embeds its own source path via the "edit on GitHub" link, which gives an exact
 *   source file → route → anchor-set
 * map straight from what Astro actually produced. CMS-backed pages are included
 * automatically because they are in the build too.
 *
 * Usage:
 *   node scripts/verify-internal-links.mjs <file...>   # check specific source files
 *   node scripts/verify-internal-links.mjs --changed   # files changed vs HEAD (default)
 *   node scripts/verify-internal-links.mjs --all        # every content file
 *   node scripts/verify-internal-links.mjs --json       # machine-readable output
 *
 * Requires a build: run `pnpm build` first (the skill does this). If `dist/` is
 * missing the script exits 2 and says so.
 *
 * Exit codes: 0 = clean · 1 = broken link(s) found · 2 = no build to check against.
 */

import { readFileSync, existsSync, statSync, globSync } from 'node:fs';
import { join, dirname, relative, resolve, extname } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const DIST = join(ROOT, 'dist');
const CONTENT_DIR = join(ROOT, 'src/content');

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const mode = argv.includes('--all')
  ? 'all'
  : argv.includes('--changed')
    ? 'changed'
    : argv.filter((a) => !a.startsWith('--')).length
      ? 'files'
      : 'changed';

const noBuild = argv.includes('--no-build');

/** Newest mtime among the inputs that affect routes/anchors. */
function newestSourceMtime() {
  const inputs = [
    ...globSync('**/*.{md,mdx}', { cwd: CONTENT_DIR }).map((r) => join(CONTENT_DIR, r)),
    join(ROOT, 'src/content.config.ts'),
    join(ROOT, 'astro.config.mjs'),
    join(ROOT, 'chromatic-config/options.json'),
  ];
  let newest = 0;
  for (const f of inputs) {
    try {
      newest = Math.max(newest, statSync(f).mtimeMs);
    } catch {
      /* missing optional input */
    }
  }
  return newest;
}

/** When was dist/ built? Use the index page's mtime as the build stamp. */
function distBuiltAt() {
  try {
    return statSync(join(DIST, 'index.html')).mtimeMs;
  } catch {
    return 0;
  }
}

const missing = !existsSync(DIST);
const stale = !missing && newestSourceMtime() > distBuiltAt();

if (missing || stale) {
  if (noBuild) {
    const why = missing ? 'dist/ not found' : 'dist/ is older than your source edits';
    const msg = `${why} — run \`pnpm build\` before verifying (or drop --no-build to auto-build).`;
    console.error(asJson ? JSON.stringify({ error: msg }) : msg);
    process.exit(2);
  }
  console.error(
    `▶ ${missing ? 'No build found' : 'Source changed since last build'} — running \`pnpm build\`…`
  );
  try {
    execSync('pnpm build', { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] });
  } catch {
    const msg = 'pnpm build failed — fix the build, then re-run the link check.';
    console.error(asJson ? JSON.stringify({ error: msg }) : msg);
    process.exit(2);
  }
}

// ---------------------------------------------------------------------------
// 1. Build the authoritative index from dist/.
//    route -> { anchors:Set, source:string }, plus source -> route.
// ---------------------------------------------------------------------------
const NOISE_ID = /^(radix-|algolia-|docsearch$|hs-|copy-md-|react-aria)/;

// AnchorJS (src/components/Scripts.astro) runs client-side:
//   anchors.add('summary:not(.no-anchor), .config-option')
// so those elements get anchor ids generated in the browser from their text —
// real on the live page, ABSENT from static HTML. Replicate AnchorJS's `urlify`
// so e.g. a `.config-option` reading "autoAcceptChanges" yields "autoacceptchanges".
const ANCHORJS_TARGET_CLASSES = ['config-option'];
const ANCHORJS_NONSAFE = /[& +$,:;=?@"#{}|^~[`%!'<>\]./()*\\\n\t\v ]/g;

function anchorjsUrlify(text) {
  return text
    .trim()
    .replace(/'/g, '')
    .replace(ANCHORJS_NONSAFE, '-')
    .replace(/-{2,}/g, '-')
    .substring(0, 64) // AnchorJS default truncate
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extract anchor ids a reader could link to: #headings, <summary>, manual ids, and client-side AnchorJS targets. */
function anchorsFromHtml(html) {
  const set = new Set();
  for (const m of html.matchAll(/<(?:h[1-6]|summary)\b[^>]*?\bid="([^"]+)"/gi)) {
    set.add(m[1].toLowerCase());
  }
  // explicit, author-authored ids (e.g. <span id="..."> anchors), minus framework noise
  for (const m of html.matchAll(/\bid="([^"]+)"/g)) {
    const id = m[1];
    if (!NOISE_ID.test(id) && /^[a-z0-9][a-z0-9_-]*$/i.test(id)) set.add(id.toLowerCase());
  }
  // client-side AnchorJS targets (ids not present in static HTML)
  for (const cls of ANCHORJS_TARGET_CLASSES) {
    const re = new RegExp(
      `<(\\w+)\\b[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>([\\s\\S]*?)<\\/\\1>`,
      'gi'
    );
    for (const m of html.matchAll(re)) {
      const id = anchorjsUrlify(stripTags(m[2]));
      if (id) set.add(id);
    }
  }
  return set;
}

const routeToAnchors = new Map(); // "/docs/foo" -> Set<string>
const sourceToRoute = new Map(); // abs source path -> "/docs/foo"

for (const rel of globSync('**/index.html', { cwd: DIST })) {
  const html = readFileSync(join(DIST, rel), 'utf8');
  const route = '/docs' + (rel === 'index.html' ? '' : '/' + rel.replace(/\/index\.html$/, ''));
  routeToAnchors.set(route, anchorsFromHtml(html));

  const edit = html.match(/edit\/[^/]+\/(src\/content\/[^"'\s)]+\.mdx?)/);
  if (edit) sourceToRoute.set(join(ROOT, edit[1]), route);
}

// ---------------------------------------------------------------------------
// 2. Link extraction (markdown links + href="..." attributes).
// ---------------------------------------------------------------------------
const LINK_RE = /\[[^\]]*\]\(\s*<?([^)>\s]+)>?(?:\s+"[^"]*")?\s*\)|href\s*=\s*["']([^"']+)["']/g;

function eachLink(raw, cb) {
  let inFence = false;
  let fenceMarker = '';
  raw.split('\n').forEach((line, i) => {
    // Toggle fenced code blocks (``` or ~~~). Anything inside is example code,
    // not a real link (e.g. `href="path/to/font.woff2"` in a preview-head.html snippet).
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      if (!inFence) {
        inFence = true;
        fenceMarker = fence[1][0];
      } else if (fence[1][0] === fenceMarker) {
        inFence = false;
        fenceMarker = '';
      }
      return;
    }
    if (inFence) return;
    // Drop inline code spans so a link inside backticks doesn't count either.
    const scrubbed = line.replace(/`[^`]*`/g, '');
    for (const m of scrubbed.matchAll(LINK_RE)) {
      const target = (m[1] || m[2] || '').trim();
      if (target) cb(target, i + 1);
    }
  });
}

// ---------------------------------------------------------------------------
// 3. Resolve a single link.
// ---------------------------------------------------------------------------
function checkLink(target, fromFile) {
  if (/^(https?:|mailto:|tel:|data:|#?$)/i.test(target)) {
    if (!target.startsWith('#')) return null; // external / empty -> out of scope
  }
  if (target.startsWith('//')) return null;

  const currentRoute = sourceToRoute.get(fromFile);

  // in-page anchor
  if (target.startsWith('#')) {
    const frag = target.slice(1).toLowerCase();
    if (!frag) return null;
    if (!currentRoute) return null; // page not in build yet — can't confirm, don't false-alarm
    return routeToAnchors.get(currentRoute)?.has(frag)
      ? null
      : { kind: 'BROKEN_ANCHOR', detail: `#${frag} — no such heading/summary/id on this page` };
  }

  const [rawPath, rawFrag] = target.split('#');
  const frag = rawFrag ? rawFrag.toLowerCase() : null;

  // /docs/... — slug route
  const docMatch = rawPath.match(/^\/docs(\/.*)?$/);
  if (docMatch) {
    const route = (rawPath.replace(/\/$/, '') || '/docs').replace(/^\/docs$/, '/docs');
    const key = route === '' ? '/docs' : route;
    if (routeToAnchors.has(key)) {
      if (frag && !routeToAnchors.get(key).has(frag)) {
        return {
          kind: 'BROKEN_ANCHOR',
          detail: `${rawPath}#${frag} — page exists, anchor does not`,
        };
      }
      return null;
    }
    return { kind: 'BROKEN_LINK', detail: `${rawPath} — no page at this route in the build` };
  }

  // other absolute site path (outside /docs) — can't verify locally
  if (rawPath.startsWith('/')) {
    return { kind: 'OFF_SITE', detail: `${rawPath} — absolute path outside /docs, not verified` };
  }

  // relative path -> another content file or an on-disk asset
  const resolved = resolve(dirname(fromFile), rawPath);
  const ext = extname(resolved).toLowerCase();

  if (ext === '.md' || ext === '.mdx' || ext === '') {
    const candidates = ext
      ? [resolved]
      : [
          `${resolved}.md`,
          `${resolved}.mdx`,
          join(resolved, 'index.md'),
          join(resolved, 'index.mdx'),
        ];
    const hit = candidates.find(existsSync);
    if (!hit)
      return {
        kind: 'BROKEN_LINK',
        detail: `${rawPath} — relative link resolves to no file on disk`,
      };
    if (frag) {
      const r = sourceToRoute.get(hit);
      if (r && !routeToAnchors.get(r)?.has(frag)) {
        return { kind: 'BROKEN_ANCHOR', detail: `${target} — file exists, anchor does not` };
      }
    }
    return null;
  }

  // asset (image, etc.)
  const assetCandidates = [
    resolved,
    join(ROOT, 'public', rawPath.replace(/^\//, '')),
    join(DIST, rawPath.replace(/^\//, '')),
  ];
  return assetCandidates.some(existsSync)
    ? null
    : { kind: 'BROKEN_FILE', detail: `${rawPath} — asset not found on disk` };
}

// ---------------------------------------------------------------------------
// 4. Choose files, run, report.
// ---------------------------------------------------------------------------
function changedContentFiles() {
  const paths = new Set();
  try {
    const diff = execSync('git diff --name-only HEAD', { cwd: ROOT, encoding: 'utf8' });
    for (const p of diff.split('\n')) if (p.trim()) paths.add(p.trim());

    const untracked = execSync('git ls-files --others --exclude-standard', {
      cwd: ROOT,
      encoding: 'utf8',
    });
    for (const p of untracked.split('\n')) if (p.trim()) paths.add(p.trim());
  } catch {
    return [];
  }

  return [...paths]
    .filter((p) => /src\/content\/.+\.(md|mdx)$/.test(p))
    .map((p) => join(ROOT, p))
    .filter(existsSync);
}

let targets;
if (mode === 'all')
  targets = globSync('**/*.{md,mdx}', { cwd: CONTENT_DIR }).map((r) => join(CONTENT_DIR, r));
else if (mode === 'changed') targets = changedContentFiles();
else
  targets = argv
    .filter((a) => !a.startsWith('--'))
    .map((p) => resolve(ROOT, p))
    .filter(existsSync);

const BROKEN = new Set(['BROKEN_LINK', 'BROKEN_ANCHOR', 'BROKEN_FILE']);
const findings = [];
const notInBuild = [];
for (const file of targets) {
  if (!sourceToRoute.has(file) && existsSync(file)) {
    // page exists in source but not in current build — its own #anchors can't be checked
    if (statSync(file).isFile()) notInBuild.push(relative(ROOT, file));
  }
  eachLink(readFileSync(file, 'utf8'), (target, line) => {
    const res = checkLink(target, file);
    if (res) findings.push({ file: relative(ROOT, file), line, target, ...res });
  });
}

const broken = findings.filter((f) => BROKEN.has(f.kind));

if (asJson) {
  console.log(
    JSON.stringify(
      { checked: targets.length, brokenCount: broken.length, notInBuild, findings },
      null,
      2
    )
  );
} else {
  if (!targets.length)
    console.log('No content files to check (use --all, --changed, or pass file paths).');
  const byFile = new Map();
  for (const f of findings) (byFile.get(f.file) ?? byFile.set(f.file, []).get(f.file)).push(f);
  for (const [file, items] of byFile) {
    console.log(`\n${file}`);
    for (const it of items) {
      const mark = BROKEN.has(it.kind) ? '✗' : '·';
      console.log(`  ${mark} ${it.kind.padEnd(13)} L${it.line}  ${it.detail}`);
    }
  }
  if (notInBuild.length) {
    console.log(
      `\n⚠ Not in current build (rebuild to verify their own #anchors): ${notInBuild.join(', ')}`
    );
  }
  console.log(
    `\nChecked ${targets.length} file(s): ${broken.length} broken link(s), ${findings.length - broken.length} informational.`
  );
}

process.exit(broken.length ? 1 : 0);
