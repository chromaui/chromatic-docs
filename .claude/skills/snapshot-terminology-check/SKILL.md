---
name: snapshot-terminology-check
description: >-
  Verify that a Chromatic docs page uses snapshot terminology per the accepted
  "Billed Snapshots" proposal — snapshots are units of work that incur "billed
  snapshots" (the unit of billing), never interchangeable. Use when writing,
  editing, or reviewing any page that mentions snapshots, captures, TurboSnap,
  billing, usage, or plan limits, or when asked to "check terminology", "audit
  snapshot terms", "does this page meet the terminology criteria", or review a
  docs PR touching snapshot/billing language.
---

# Snapshot terminology check

## What this skill is for

The accepted [“Billed Snapshots” proposal](https://app.notion.com/p/chromatic-ui/Billed-Snapshots-Proposal-3896e81620348038a114f174b387dc95)
fixed a long-standing ambiguity: docs drifted between `snapshots` meaning
"pixel-perfect images" and meaning units of usage/billing. The rules, ontology,
and worked examples are restated in [TERMINOLOGY.md](TERMINOLOGY.md) — **read it
before evaluating anything**. The two load-bearing rules:

1. A `snapshot` is a unit of **work**; plural `snapshots` always takes a
   modifier (`visual`, `captured`, `total`, …).
2. A `billed snapshot` is a unit of **billing** — the cost (0–1) a snapshot
   incurs, not a type of snapshot. Attribute it with separated modifiers:
   `billed snapshots from turbosnaps`, never `billed turbosnaps`.

## Division of labor

Pattern-shaped rules live in `scripts/check-terminology.mjs` — deterministic,
same result every run. Do **not** re-derive them by reading; run the script.
You judge only what needs a reader: context, meaning, and intent (step 3).

## Workflow

### 1. Identify the target

Page path(s) from the request, the open file, or `--changed` for PR review.
Only `src/content/**` prose matters.

### 2. Run the deterministic checker

```bash
node .claude/skills/snapshot-terminology-check/scripts/check-terminology.mjs <file...>
# --changed : also check all .md/.mdx changed vs git HEAD under src/content
# --json    : machine-readable findings
```

The script sanitizes each page first — frontmatter, code fences, inline code,
link URLs, MDX imports, HTML/JSX tags, and comments are exempt by
construction (link _text_ is still checked) — then reports findings with
`line:col`, excerpt, and suggestion:

**ERROR — deterministic violations. Final; report as-is, never re-litigate:**

- `fused-billing-modifier` — `billed turbosnaps`, `billed captures`, `billed visual …`
- `contradictory-modifiers` — `inherited capture`, `captured turbosnap`, …
- `turbosnap-casing` — `Turbosnap`, `turboSnap`, `TURBOSNAP`

**REVIEW — candidates only a reader can settle (step 3):**

- `bare-plural` — plural `snapshots` whose preceding word isn't a known
  modifier (the word, if any, is shown)
- `billed-as-type-phrasing` — verbs of work (take/capture/run/…) applied to a
  `billed snapshot`
- `turbosnap-plural-feature` — `TurboSnaps`
- `snapshot-as-verb` — `snapshot`/`snapshots` used as a verb instead of a
  noun: gerund/participle (`snapshotting`, `snapshotted`), infinitive
  (`to snapshot`), modal + bare stem (`will snapshot`), or `snapshot(s)`
  governing a direct object (`it snapshots your UI`). Suppresses `bare-plural`
  on the same match — the fix is a rewrite, not a modifier.
- `retest-as-recapture` — `re-test`/`retest` (any inflection) describing the
  act of triggering a new snapshot; should be `re-capture`/`recapture`

Exit codes: `0` no errors (REVIEW may exist) · `1` errors · `2` usage or
self-test failure. If you change the script or the rules in TERMINOLOGY.md,
run `--self-test` and keep both in sync.

### 3. Read the full page; judge what needs a reader

Context decides these — never judge from script output alone:

| Judgment call                                                                                                                        | Verdict                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `bare-plural`, no modifier: does the paragraph establish the type?                                                                   | ok if clear antecedent; else **warning** — add modifier or `total snapshots` |
| `bare-plural`, unknown modifier (`baseline`, `multiple`, …): established term or invented type?                                      | **warning** if invented/off-ontology                                         |
| `billed-as-type-phrasing` confirmed — billed snapshot described as work                                                              | **error** — snapshots _incur/generate_ billed snapshots                      |
| `billable` ↔ `billed` swapped (meaning-level; invisible to the script)                                                              | **error**                                                                    |
| Correctly-cased `TurboSnap`/`turbosnap` but feature/type usage mismatched                                                            | **warning**                                                                  |
| Singular `snapshot` with clear contextual type                                                                                       | ok                                                                           |
| `snapshot-as-verb` confirmed — prose describing the product's action                                                                 | **warning** — rewrite around `capture`/`generate`/`take`                     |
| `snapshot-as-verb` on a literal UI string/option name quoted from the product (e.g. a checkbox labeled "auto snapshotting disabled") | judgment call — renaming is a product decision, note it                      |
| `retest-as-recapture` confirmed — describes a new snapshot being triggered, not the broader visual-test run                          | **warning** — use `re-capture`/`recapture`                                   |
| `retest-as-recapture` — genuinely means re-running the whole visual test (rare)                                                      | ok, leave as `retest`/`re-test`                                              |
| Literal UI-string names quoted from the product (chart titles, the "Snapshots" nav page)                                             | judgment call — renaming is a product decision, note it                      |

### 4. Report

Output a verdict (**PASS** / **FAIL** with error+warning counts — script
ERRORs plus your confirmed judgments), then a table:
`line · excerpt · rule broken · severity · suggested rewrite`. Quote the
minimal excerpt. For warnings, say what modifier the context implies.

**Do not edit the page unless the user asks for fixes.** When they do, apply
the suggested rewrites, re-run the script, re-judge the REVIEW items, and
report the new verdict. If edits change any headings, links may break — run
the `docs-link-check` skill afterwards.
