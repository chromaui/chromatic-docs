---
name: fix-accessibility-violations
description: Finds accessibility violations reported by a Chromatic build, fixes them in the component source, and verifies the fix on the next build. Use when a Chromatic build reports accessibility changes, when CI fails on a11y, or when the user asks to fix axe or WCAG violations.
---

# Fix accessibility violations

Work from the violations a Chromatic build actually found, fix them at the
component source, and confirm the fix on the next build.

## Workflow

Track progress against this checklist:

```
A11y progress:
- [ ] Step 0: Know what a scope refusal looks like
- [ ] Step 1: Find the build for this branch
- [ ] Step 2: List what changed
- [ ] Step 3: Read one violation's diff
- [ ] Step 4: Fix the component
- [ ] Step 5: Verify on the next build
```

### Step 0: Know what a scope refusal looks like

All four `chromatic_*` tools are always listed; the server does not hide them
by scope. A call beyond the token's grant fails with a 403 challenge whose
`WWW-Authenticate` header names the missing scope. `chromatic_get_latest_build`
needs `project:read`; `chromatic_list_accessibility_changes` and
`chromatic_get_accessibility_diff` need `build:read`.

When a call is refused for scope, report the scope the challenge names and
stop:

> Chromatic refused the call because this access token lacks the `build:read`
> scope. Re-run the Chromatic login; if the call is refused again afterwards,
> the OAuth client has not been permitted to request that scope yet.

Do not work around a refusal by reading the component source and inferring what
is probably wrong. That produces a confident answer with nothing behind it,
which is worse for the user than being told the call was refused.

### Step 1: Find the build for this branch

Call `chromatic_get_latest_build` with `projectId`, and `branches` set to the
current branch from `git branch --show-current` — it takes an array.

**Finding the project id.** Read `projectId` from `chromatic.config.json` at
the repository root: Chromatic's setup writes it there and expects the file to
be committed, so it is usually already in front of you. The value may carry a
`Project:` prefix; the tool accepts it either way. If this repository's
`AGENTS.md` records the id as well, either source is fine — they should agree.

If the file is missing or carries no `projectId`, do not guess and do not
derive one from the repository name. Ask the user for a link to the project in
the Chromatic web app (every project URL carries the id as `appId=`) or for the
id from the project's Manage page, then write `chromatic.config.json` so the
next run finds it. The `connect-project` skill is that exact procedure;
follow it, then come back here. A project token (what the CLI and CI
authenticate with) is not a project id, and the tool refuses it.

If the build has not finished, the accessibility tools answer that its tests
are not available yet — say so and stop rather than working from a partial
picture. If `isSuperseded` is true, a newer build exists and the violations may
already be gone.

### Step 2: List what changed

Call `chromatic_list_accessibility_changes` with the build id. This returns the
stories whose accessibility results changed in this build, improvements
included — a story whose violations went down needs no work.

If the result says `truncated`, the scan stopped early; call again with `after`
set to `nextCursor` before concluding anything about the build.

Fix regressions, not the whole backlog. A violation accepted in a prior review
is out of scope unless the user asks for it. A story whose violations were all
accepted earlier and did not move is not in this listing at all. That is not a
clean story: if the user asks about it, `chromatic_get_accessibility_diff` in
step 3 still returns its accepted violations.

Each story carries its review status. A story marked `ACCEPTED` was already
signed off by a reviewer in this build, regressions included. On a story's
first snapshot every violation counts as a regression, so this is common. Ask
the user before fixing an accepted story.

### Step 3: Read one violation's diff

Call `chromatic_get_accessibility_diff` with the build id and story id — the
`storyId` field from step 2. Where that field is null the listing falls back to
a test id, which this tool does not accept; skip that entry or open its
`webUrl` instead.

The diff lists every rule with a violation, changed or not. Each rule
separates regression, resolved, and accepted selectors. Fix the regressions.
Accepted selectors were acknowledged in a prior review; leave them unless
asked.

What an answer with no rules means depends on the rendering:

- `no violations` (`rules` is empty): the story is clean at that viewport.
- `no accessibility result` (`rules` is null): the capture or its diff did not
  finish, so nothing is known. Say so, and point at the `webUrl` test page
  rather than calling the story clean.

Work one story at a time. Reading every diff up front fills context with
violations you have not fixed yet.

### Step 4: Fix the component

Map the story back to its source file and fix the underlying markup. Fix the
component, not the story: a violation reproduced by one story is usually present
everywhere that component renders.

Common rules and what they actually mean:

| Rule                 | The real fix                                                |
| -------------------- | ----------------------------------------------------------- |
| `color-contrast`     | Change the token or theme value, not that one component     |
| `button-name`        | Give the control an accessible name, not a `title`          |
| `image-alt`          | Write real alt text; empty `alt=""` only for decoration     |
| `aria-required-attr` | Add the attribute the role requires, or drop the role       |
| `label`              | Associate a real `<label>`; placeholder text is not a label |

Every rule in the diff carries a `helpUrl` pointing at the axe documentation for
it. When a rule is one you do not already know cold, read that page before
changing anything, and cite it when you explain the fix. Axe rules have specific
pass conditions, and a plausible-looking change that does not meet them leaves
the violation in place while looking resolved. Do not invent a remedy for a rule
you have not looked up.

Never silence a violation by disabling the rule or adding an a11y ignore
annotation unless the user explicitly asks for it. Suppression makes the report
green while leaving the page unusable.

### Step 5: Verify on the next build

A fix is only confirmed once a new Chromatic build has run against it. Push the
change, wait for the build, and call `chromatic_get_latest_build` again, then
`chromatic_get_accessibility_diff` for the same story on the new build id. The
fix took when the rule shows no regressions and the selectors you fixed are
listed as resolved. The story may still appear in
`chromatic_list_accessibility_changes` with a negative net count: that listing
includes improvements, and an improvement is what a fix looks like.

**There is no step where you accept the test, and you should not look for one.**
Chromatic folds a genuine fix into the baseline automatically: the update needs
no review. Accepting is how a team _defers_ a violation it has not fixed,
so reaching for it after a real fix would be the opposite of what you just did.

If the rule still shows regressions, the fix did not take. Go back to step 3
and read the diff on the new build rather than re-reading the old one.
