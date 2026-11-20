---
name: editorial-review
description: Editorial review of a set of Chromatic docs pages as a whole (a PR, a sidebar section, or named pages) for structure and coherence across the reader's path, then apply only the fixes the user approves. Use when the user asks for an "editorial pass", "editorial review", "fresh eyes", a "structural review", to "step back and review the whole PR", to "review this section", or asks "does this section hang together". Not for line-level copy edits or posting a review on a teammate's PR; that's dx-review.
---

# Editorial review

Read a set of docs pages the way a reader travels through them and find what breaks that path: pages that contradict each other, links that promise what isn't there, a structure that hides the content, the same thing said in three places. Report first, wait for decisions, then apply only what the user approves.

This is an **editor's pass, not a copy edit**. Line-level wording, house style, and PR review comments belong to `dx-review`. Pick findings at the altitude of the [example findings](#example-findings) below.

## 1. Scope and sync

Identify the page set:

- **A PR:** `gh pr diff <N> --name-only`, filtered to `src/content/`.
- **A section:** every file in the collection folder under `src/content/<collection>/`.
- **Named pages:** what the user listed.

Then add the **entry page** of the section and the sidebar neighbours of each page (same collection, adjacent `sidebar.order`). Readers arrive from those.

Sync before reading: `git pull` on the branch. Run `git status` and note any uncommitted edits by the user. Those files are theirs; read them as they are and leave them untouched when applying.

Done when you have a written page list, with the user's uncommitted files marked.

## 2. Read whole pages

Read every page in the list **top to bottom**, not the diff. Contradictions and repetition live between pages and between sections, where a diff never looks.

Look at each page's headings as the reader sees them, in the built TOC:

```bash
pnpm build   # skip if dist/ is fresh
grep -oE 'id="[^"]+"' dist/<route>/index.html
```

`grep -ril '<key term>' src/content/` for the set's main concepts, to find other pages that cover or depend on them.

Done when every page in the list has been read in full and you have its heading outline.

## 3. Check, in order of impact

Work through [references/checklist.md](references/checklist.md) in order. It is ranked by how badly each problem hurts a reader:

1. **Contradictions and broken references across pages**
2. **Information architecture**
3. **Single source of truth**
4. **Repetition within a page**
5. **Tone and claims**
6. **Consistency**

Run `docs-link-check` (`node scripts/verify-internal-links.mjs <files>`) over the page set; every `BROKEN_*` finding goes in group A. If a page mentions snapshots, billing, or usage, run `snapshot-terminology-check` on it and fold its findings into group C.

Done when every checklist category has been applied to every page, and each finding names its file and heading.

## 4. Report, then stop

Lead with a **one-line verdict** (e.g. "Hangs together, but two pages contradict each other on auth and the setup page is a dead end.").

Then a numbered list, numbered straight through so the user can answer "yes to 1–4, 7; skip 9":

- **A. Contradictions and broken** — a reader would act on something wrong or hit a dead link.
- **B. Structure and repetition** — architecture, source of truth, repetition.
- **C. Polish** — tone, claims, consistency.

Each item: the file and heading, what's wrong in one or two sentences, and the **concrete fix**. When the fix changes wording, include a draft of the new text. When it moves or merges content, say which page becomes the owner.

End with a recommendation: which items are mechanical (safe to apply as written) and which need the user's wording or placement decision.

Make no edits in this step. Done when the report is posted and you're waiting on the user.

## 5. Apply what the user approves

Write the decisions down first, one line per item: approved, approved with changes (and what), skipped, or deferred. Apply only the approved items. If the user changed a draft, use their version.

Make the edits (or delegate them, one agent per page to avoid conflicts) with **one commit per item or per page**. After each edit:

- `pnpm exec prettier --write` on the touched files.
- For every heading you renamed or removed, `grep -rn '#<old-anchor>' src/content/` and fix each link that pointed at it. A `<details id>` turned into a tab, or an H3 merged into its parent, silently drops an anchor.
- `node scripts/verify-internal-links.mjs <touched files>` until it exits 0.

Then a final `pnpm build` to catch MDX errors.

Done when every approved item has a commit, the link check passes on every touched page, and the build succeeds.

## 6. Report back

Tell the user, briefly:

- Each applied item with its commit hash.
- Any fact an edit dropped (merging duplicates can lose a detail one copy had and the other didn't). Name it so the user can put it back.
- **Deferred items**, listed in full with their fix, so they aren't lost.
- Skipped items, in one line.

## Example findings

Calibrate on these. Each is at the level of the reader's path, not the sentence.

1. **(A) Recommends a path another page dropped.** The MCP page still sends unattended agents to service clients, but the Cloud agents page in the same PR made agents MCP-only. Fix: rewrite the MCP paragraph to point at Cloud agents; draft included.
2. **(A) Anchor promised elsewhere no longer exists.** Three pages link to `#scopes`, which was a `<details id="scopes">` that the restructure turned into a tab. Fix: add an H3 "Scopes" above the tabs, or retarget the links.
3. **(B) The TOC is useless.** An 800-line page has three H2s, so the right rail shows three entries for the whole thing. Fix: promote the task sections to H2; proposed outline included.
4. **(B) One table, three owners.** The same scope table appears on the auth, API, and MCP pages and has drifted (one lists `project:write`, two don't). Fix: keep it on the auth page and link from the other two.
5. **(B) Dead end.** The getting-started page ends after install, with no next steps, and the section's most important page isn't linked from it. Fix: add a "Next steps" list with three links.
6. **(C) Claim that will rot.** "The plugin can't do X yet (added in v2.3, see below)". Time-bound statements and version history age badly in docs. Fix: state current behaviour only.
