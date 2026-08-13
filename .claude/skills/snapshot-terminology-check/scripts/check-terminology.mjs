#!/usr/bin/env node
// Deterministic checks for the snapshot-terminology-check skill.
// Rules mirror TERMINOLOGY.md — update both together, then run --self-test.
//
// Usage:
//   node check-terminology.mjs <file.md|.mdx ...>
//   node check-terminology.mjs --changed     # .md/.mdx changed vs git HEAD under src/content
//   node check-terminology.mjs --json <...>  # machine-readable output
//   node check-terminology.mjs --self-test
//
// Exit codes: 0 = no errors (REVIEW items may exist) · 1 = errors · 2 = usage/self-test failure

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// Words that legitimately modify plural "snapshots" (TERMINOLOGY.md ontology).
const KNOWN_MODIFIERS = new Set([
  'visual',
  'accessibility',
  'captured',
  'copied',
  'bypassed',
  'inherited',
  'turbo',
  'total',
  'billed',
  'billable',
  'non-billable',
  'potential',
  'skipped',
  'web',
  'chrome',
  'firefox',
  'safari',
  'edge',
  'mobile',
  'ios',
  'android',
]);

// Snapshot-type words that must never fuse with "billed". Longest-first.
const TYPE_WORD =
  '(?:turbo[ -]?snapshots?|turbosnaps?|turbo|captured|captures?|copied|bypassed|inherited|visual|accessibility|chrome|web|mobile|ios|android|potential|total|skipped)';

const RULES = [
  {
    id: 'fused-billing-modifier',
    severity: 'error',
    re: new RegExp(`\\bbilled[ -]${TYPE_WORD}\\b`, 'gi'),
    suggestion: 'never fuse "billed" with a snapshot type — write "billed snapshots from <type>s"',
  },
  {
    id: 'contradictory-modifiers',
    severity: 'error',
    re: /\b(?:(?:inherited|copied|bypassed)[ -]captures?\b|captured[ -]turbo[ -]?snaps?(?:hots?)?\b|captured[ -](?:copied|bypassed|inherited)\b)/gi,
    suggestion:
      'contradiction within "type of work": a snapshot is captured OR copied/bypassed, never both',
  },
  {
    id: 'turbosnap-casing',
    severity: 'error',
    re: /\b(?:Turbosnap|turboSnap|TURBOSNAP)s?\b/g, // case-sensitive on purpose
    suggestion: 'write "TurboSnap" (the feature) or "turbosnap" (the snapshot type)',
  },
  {
    id: 'billed-as-type-phrasing',
    severity: 'review',
    re: /\b(?:tak(?:e|es|en|ing)|took|captur(?:e|es|ed|ing)|run(?:s|ning)?|ran|render(?:s|ed|ing)?|creat(?:e|es|ed|ing))\s+(?:a\s+|an\s+|the\s+|your\s+|each\s+)?billed\s+snapshots?\b/gi,
    suggestion:
      'a billed snapshot is a cost, not work — snapshots incur/generate billed snapshots; confirm and rephrase',
  },
  {
    id: 'turbosnap-plural-feature',
    severity: 'review',
    re: /\bTurboSnaps\b/g, // case-sensitive on purpose
    suggestion: 'the feature name is singular; if this refers to the snapshots, use "turbosnaps"',
  },
  {
    id: 'snapshot-as-verb',
    severity: 'review',
    // Non-noun word forms: gerund/participle, infinitive, or modal + bare stem.
    // "snapshot" is a unit of work (noun) — it's taken/captured/generated, never itself the verb.
    re: /\b(?:re-?)?snapshott(?:ing|ed)\b|\bto\s+snapshot\b|\b(?:will|can|could|should|would|may|might|must)\s+snapshot\b/gi,
    suggestion:
      '"snapshot" used as a verb — Chromatic doesn\'t "snapshot" something; rewrite around "capture/generate a snapshot of …"',
  },
  {
    id: 'retest-as-recapture',
    severity: 'review',
    // "test" is the product-level action (Visual Tests); triggering a new
    // snapshot for a story specifically is a "capture" per the ontology.
    re: /\bre[- ]?test(?:s|ed|ing)?\b/gi,
    suggestion:
      'if this means triggering a new snapshot (not the broader visual-test run), use "re-capture"/"recapture" — see TERMINOLOGY.md',
  },
];

// Transitive-verb heuristic: "snapshot(s)" immediately governing a direct
// object ("it snapshots your UI", "Chromatic snapshots a story") — a noun
// can't be followed directly by a determiner without a preposition, so this
// almost always signals verb usage rather than the bare-plural noun.
const VERB_OBJECT_RE =
  /\bsnapshots?\b(?:\s+(?:only|just|solely|automatically|intelligently|then))?\s+(?:a|an|the|your|this|that|these|those|each|every|any|all|some|no|its)\b/gi;

const blank = (s) => s.replace(/\S/g, ' ');

// Blank out exempt regions, preserving line/column positions:
// frontmatter, code fences, inline code, link URLs, bare URLs,
// MDX import/export lines, HTML/JSX tags, HTML comments.
function sanitize(src) {
  const rawLines = src.split(/\r?\n/);
  const lines = [];
  let frontDone = rawLines[0]?.trim() !== '---';
  let fence = null;
  let inComment = false;
  rawLines.forEach((line, i) => {
    if (!frontDone) {
      if (i > 0 && line.trim() === '---') frontDone = true;
      lines.push(blank(line));
      return;
    }
    if (inComment) {
      const end = line.indexOf('-->');
      if (end === -1) {
        lines.push(blank(line));
        return;
      }
      line = blank(line.slice(0, end + 3)) + line.slice(end + 3);
      inComment = false;
    }
    const fenceMatch = line.match(/^\s*(```|~~~)/);
    if (fence) {
      lines.push(blank(line));
      if (fenceMatch && fenceMatch[1] === fence) fence = null;
      return;
    }
    if (fenceMatch) {
      fence = fenceMatch[1];
      lines.push(blank(line));
      return;
    }
    if (/^\s*(?:import|export)\s/.test(line)) {
      lines.push(blank(line));
      return;
    }
    let s = line;
    const cs = s.indexOf('<!--');
    if (cs !== -1) {
      const ce = s.indexOf('-->', cs);
      if (ce === -1) {
        s = s.slice(0, cs) + blank(s.slice(cs));
        inComment = true;
      } else {
        s = s.slice(0, cs) + blank(s.slice(cs, ce + 3)) + s.slice(ce + 3);
      }
    }
    s = s.replace(/`[^`]*`/g, blank);
    s = s.replace(/\]\([^)]*\)/g, (m) => ']' + ' '.repeat(m.length - 1)); // keep link text
    s = s.replace(/https?:\/\/\S+/g, blank);
    s = s.replace(/<\/?[A-Za-z][^<>]*>/g, blank);
    lines.push(s);
  });
  return { rawLines, lines };
}

function excerptAt(rawLine, col, len) {
  const start = Math.max(0, col - 35);
  const end = Math.min(rawLine.length, col + len + 35);
  return (
    (start > 0 ? '…' : '') + rawLine.slice(start, end).trim() + (end < rawLine.length ? '…' : '')
  );
}

function checkSource(src) {
  const { rawLines, lines } = sanitize(src);
  const findings = [];
  lines.forEach((line, idx) => {
    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(line)) !== null) {
        findings.push({
          line: idx + 1,
          col: m.index + 1,
          rule: rule.id,
          severity: rule.severity,
          match: m[0],
          excerpt: excerptAt(rawLines[idx], m.index, m[0].length),
          suggestion: rule.suggestion,
        });
      }
    }
    // snapshot-as-verb (object heuristic): "snapshots"/"snapshot" directly
    // governing a direct object. Takes precedence over bare-plural below —
    // the fix here is "rewrite as a verb phrase", not "add a modifier".
    VERB_OBJECT_RE.lastIndex = 0;
    const verbObjectIndices = new Set();
    let vm;
    while ((vm = VERB_OBJECT_RE.exec(line)) !== null) {
      verbObjectIndices.add(vm.index);
      findings.push({
        line: idx + 1,
        col: vm.index + 1,
        rule: 'snapshot-as-verb',
        severity: 'review',
        match: vm[0],
        excerpt: excerptAt(rawLines[idx], vm.index, vm[0].length),
        suggestion:
          '"snapshot" used as a verb — Chromatic doesn\'t "snapshot" something; rewrite around "capture/generate a snapshot of …"',
      });
    }

    // bare-plural: plural "snapshots" not preceded by a known modifier
    const re = /\bsnapshots\b/gi;
    let m;
    while ((m = re.exec(line)) !== null) {
      if (verbObjectIndices.has(m.index)) continue;
      const before = line.slice(0, m.index);
      const prev = before.match(/([A-Za-z][A-Za-z-]*)[*_]{0,3}\s+$/);
      const prevWord = prev ? prev[1] : null;
      if (prevWord && KNOWN_MODIFIERS.has(prevWord.toLowerCase())) continue;
      findings.push({
        line: idx + 1,
        col: m.index + 1,
        rule: 'bare-plural',
        severity: 'review',
        match: m[0],
        prevWord,
        excerpt: excerptAt(rawLines[idx], m.index, m[0].length),
        suggestion: prevWord
          ? `"${prevWord}" is not a known modifier — established term, or should this be a typed/total snapshot?`
          : 'no modifier — does context establish the type? If not, add one or use "total snapshots"',
      });
    }
  });
  findings.sort((a, b) => a.line - b.line || a.col - b.col);
  return findings;
}

function changedFiles() {
  const run = (cmd) => execSync(cmd, { encoding: 'utf8' }).split('\n').filter(Boolean);
  const files = new Set([
    ...run('git diff --name-only HEAD -- src/content'),
    ...run('git ls-files --others --exclude-standard -- src/content'),
  ]);
  return [...files].filter((f) => /\.(md|mdx)$/.test(f));
}

const FIXTURES = [
  ['Your plan includes 35,000 billed turbosnaps.', ['fused-billing-modifier']],
  ['billed snapshots from turbosnaps trigger overages.', []],
  ['Each build had three inherited captures.', ['contradictory-modifiers']],
  ['Turbosnap speeds up your builds.', ['turbosnap-casing']],
  ['TurboSnap is a feature; a turbosnap is a snapshot type.', []],
  ['Chromatic takes a billed snapshot for each test.', ['billed-as-type-phrasing']],
  ['Each build uses snapshots.', ['bare-plural']],
  ['We compare baseline snapshots to new ones.', ['bare-plural']],
  ['Captured visual chrome snapshots appear here.', []],
  ['`billed turbosnaps` is exempt as inline code.', []],
  ['See [billed turbosnaps](/docs/billing) — link text is checked.', ['fused-billing-modifier']],
  ['TurboSnaps reduce billing.', ['turbosnap-plural-feature']],
  ['---\ntitle: Snapshots everywhere\n---\n\n```\nbilled turbosnaps\n```\n\nClean prose.', []],
  ['<!-- billed turbosnaps -->ok text', []],
  ['It intelligently snapshots only the stories that changed.', ['snapshot-as-verb']],
  ['It also snapshots any tests that were denied on the ancestor build.', ['snapshot-as-verb']],
  ['When Chromatic snapshots a Storybook story, it trims the result.', ['snapshot-as-verb']],
  ['You can specify stories to snapshot.', ['snapshot-as-verb']],
  ['Chrome must be included for snapshotting.', ['snapshot-as-verb']],
  [
    'Baselines that were snapshotted on old infrastructure are re-snapshotted.',
    ['snapshot-as-verb'],
  ],
  ['Chromatic will snapshot your stories automatically.', ['snapshot-as-verb']],
  ['This would create two Chromatic snapshots.', ['bare-plural']],
  ['Chromatic snapshots sometimes show the initial loading state.', ['bare-plural']],
  ['Chromatic captures visual snapshots of every story.', []],
  [
    'To avoid false positives, we re-test everything in the following situations.',
    ['retest-as-recapture'],
  ],
  ['TurboSnap retests everything whenever the preview file changes.', ['retest-as-recapture']],
  ['Use the untraced flag to avoid re-testing dependent stories.', ['retest-as-recapture']],
  [
    'Do the onlyStoryNames and onlyStoryFiles options have similar retest logic?',
    ['retest-as-recapture'],
  ],
  ['This contest and protest are unrelated words.', []],
];

function selfTest() {
  let failed = 0;
  FIXTURES.forEach(([src, expected], i) => {
    const got = [...new Set(checkSource(src).map((f) => f.rule))].sort();
    const want = [...expected].sort();
    if (JSON.stringify(got) !== JSON.stringify(want)) {
      failed++;
      console.error(`✗ fixture ${i + 1}: ${JSON.stringify(src.slice(0, 60))}`);
      console.error(`    expected ${JSON.stringify(want)}, got ${JSON.stringify(got)}`);
    }
  });
  console.log(
    failed === 0
      ? `✓ self-test: ${FIXTURES.length}/${FIXTURES.length} fixtures pass`
      : `✗ self-test: ${failed}/${FIXTURES.length} fixtures FAILED`
  );
  process.exit(failed === 0 ? 0 : 2);
}

// --- main ---
const argv = process.argv.slice(2);
const json = argv.includes('--json');
if (argv.includes('--self-test')) selfTest();
let files = argv.filter((a) => !a.startsWith('--'));
if (argv.includes('--changed')) files = [...new Set([...files, ...changedFiles()])];
if (files.length === 0) {
  console.error(
    'usage: check-terminology.mjs [--json] [--changed] [--self-test] <file.md|.mdx ...>'
  );
  process.exit(2);
}

const results = files.map((file) => ({
  file,
  findings: checkSource(readFileSync(file, 'utf8')),
}));

let errors = 0;
let reviews = 0;
if (json) {
  console.log(JSON.stringify(results, null, 2));
  for (const { findings } of results)
    for (const f of findings) f.severity === 'error' ? errors++ : reviews++;
} else {
  for (const { file, findings } of results) {
    if (findings.length === 0) continue;
    console.log(file);
    for (const f of findings) {
      f.severity === 'error' ? errors++ : reviews++;
      const tag = f.severity === 'error' ? 'ERROR ' : 'REVIEW';
      console.log(`  ${tag} ${f.line}:${f.col} ${f.rule} — "${f.match}"`);
      console.log(`         ${f.excerpt}`);
      console.log(`         → ${f.suggestion}`);
    }
  }
  console.log(`\n${errors} error(s), ${reviews} review candidate(s) in ${files.length} file(s)`);
}
process.exit(errors > 0 ? 1 : 0);
