# Chromatic docs house style

These rules come from the edits the docs lead pushed onto other people's PRs between 2024 and 2026. Each rule includes the reason and real before → after pairs with PR numbers. Apply them to the lines a PR adds or changes.

The common thread: readers arrive with a problem and want the answer, the action, or the exact error. Every rule below removes something that sits between the reader and that.

## Contents

1. [Sentences](#1-sentences)
2. [Headings and titles](#2-headings-and-titles)
3. [FAQs](#3-faqs)
4. [Lists, steps, tables, and structure](#4-lists-steps-tables-and-structure)
5. [Links](#5-links)
6. [Code blocks](#6-code-blocks)
7. [Terminology](#7-terminology)

---

## 1. Sentences

**Cut filler, teasers, editorializing, and justification tails.** This is the most frequent edit by far. Delete sentences that set up the topic, restate it, or add opinion. Start with the action or the fact.

- "Your decision wins. Once you accept or deny…" → "Once you accept or deny…" (#879)
- "There's no automation (yet!) for switching Git providers for Git-linked accounts. Here's how to migrate your Chromatic projects…" → "To migrate your Chromatic projects to the new Git provider:" (#676)
- "Storybook makes it easier to write component tests using the play() function, but what about components that use shadow DOM like Web Components? With the help of…" → "With the help of [shadow-dom-testing-library](…)…" (#673)
- "adds noise without providing information" → "adds noise" (#879)
- "Deleting builds is a tricky concept for us." → deleted (#498)

**Lead with the answer, then the reason, then the caveat.** If a recommendation sits at the end of a paragraph, move it to the front.

- "Passing a storybook dev built is possible, but we highly recommend not doing that." (last line) → first line: "Although you can use a development build of your Storybook with Chromatic, we recommend against it." (#461)
- "No, Chromatic does not take snapshots of every step… Instead,…" → "No, Chromatic waits for the entire play function to execute and captures a snapshot only at the end." This is followed by a new paragraph with the recommended alternative and a link. (#563)

**Imperative and second person.** Use "you" for the reader and "Chromatic" for the product's behavior. "We" is fine for recommendations ("We recommend running Chromatic on push events"), not for describing behavior. Use "you" instead of "a customer" or "users".

- "you'll need to identify which import pulled in the changes" → "identify which import caused the changes" (#745)
- "With the above adjustments in place, you can use shadow root queries…" → "Use shadow root queries directly in your play() function, like so:" (#673)
- "This file is generated when a customer adds `--stats-json`" → "…when you add `--stats-json`" (#573)
- "The actual scopes we request" → "The actual scopes that Chromatic requires" (#630)

**Remove hedging when the fact is certain.** "You may not need to maintain that setup yourself anymore." → "You don't need to…" (marketing #57). Keep the hedge if the claim really is conditional. That's a question for the author, not a copy edit.

**Never leave the reader at a dead end.** Replace "this guide won't help" with what to check next.

- "If it fails locally too, you have an ordinary test bug, and the rest of this guide won't help." → "If it fails locally too, then it's likely a bug in the test. Check the syntax, queries, and assertions." (#881)

**State the other half of a rule.** When a sentence covers one case, add the complementary case if the PR's own content implies it.

- "Each assigned Team grants its configured project role." → adds "If the user is in multiple teams with different roles on the same project, the highest applies." (#883)
- "Stories excluded by these options are billed at the copied snapshot rate…" → adds "The rest are billed at the normal rate of 1 billed snapshot per captured snapshot." (#899)

**Be specific instead of vague.** Replace a vague label with the exact behavior or error.

- "Storybook issue" (×3) → "Failed to run build-storybook script" / "Failed to start Storybook" / "Unable to load Storybook or one of the stories" (#477). If you don't know the specifics, ask.
- "the page hits error 404" → "If you encounter a 404 error" (#569); "most recent build" → "latest build"

**Punctuation**

- **Em dashes:** take them out of sentences. Use a period, comma, colon, or parentheses instead. Keep them in structured `**Label** — definition` lines, in table cells that follow that pattern, and in frontmatter descriptions.
  - "hidden dependencies—changing a button's padding" → "hidden dependencies. Changing a Button's padding" (#745)
  - "🟡 Pending — blocks merging…" → "🟡 Pending: blocks merging…" (#855)
- **Oxford comma:** "steps 1, 3 and 4" → "steps 1, 3, and 4" (#676)
- **No slash for "or":** "incognito/private" → "incognito or private" (#646)
- **"e.g." or "such as", never "ex.":** "(ex. barrels, shared utils…)" → "such as barrels, shared utilities, and theme objects" (#745)
- **No exclamation marks in prose:** "…reach into `shadowRoot`!" → "…`shadowRoot`." (#673)
- **No decorative emphasis:** drop bold or italics used for flair ("**architectural anti-patterns**" → plain). Bold is for UI labels and term definitions.

## 2. Headings and titles

**Sentence case** for `title`, H1, headings, and sidebar labels. Product and feature names keep their capitals.

- "TurboSnap Dependency Tracing" → "TurboSnap dependency tracing" (#573)
- "Diagnosing Preview Rebuilds" → "Diagnose preview rebuilds" (#745)

**`title` and H1 match exactly.** The sidebar label can be shorter ("Preview rebuilds").

**No SEO subtitles or stacked qualifiers in titles.**

- "# TurboSnap Configuration Best Practices: Tips for Faster Visual Testing" → "# TurboSnap best practices" (#658)
- "Chromatic API for Agents — Private Beta — Getting Started" → "Chromatic API (Private Beta)" (#803)

**Task headings are imperatives, not gerunds.** "Using globbing features" → "Use globbing features" (#745).

**Numbered procedures use `### 1. Short imperative`.** No trailing colon or period. Move the detail into a sentence under the heading.

- "### 3. Prepend your Cypress run command with the following environment variable, defining which port…" → "### 3. Specify the port for Chrome DevTools Protocol to listen on" plus a body sentence (#348)
- "### 6. Run a Chromatic build (using the token you noted above):" → "### 6. Run a Chromatic build" (#348)
- "## 5. Handle timing and asynchrony" → "## 5. Check for timing issues" (#881). Plain verbs like "Check" and "Review" match neighbouring steps.

**Bold pseudo-headings become real headings, at the right level.**

- "1. **Ensure you've built your Storybook to write your stats JSON**" → "### 1. Configure your Storybook to generate stats JSON" (#745)
- "**Important things to know:**" → "### Important things to know" (#858)
- A `###` directly under the H1 with no `##` parent gets promoted to `##` (#858, #756, #745).

**Put the real subject in the heading, not a pronoun.** "How does this interact with accessibility tests?" → "How does auto-ignore impact accessibility tests?" (#879)

## 3. FAQs

FAQs live in two places: standalone files in `src/content/troubleshooting/faq/*.mdx`, and `<details><summary>` blocks inside feature pages. The same rules apply to both.

**Phrase them as full, natural questions that end in "?".** Use "Why does…?", "How do I…?", "Can I…?". Avoid "How to…?", and avoid a statement followed by "Why?". Add enough context that the question makes sense in a search result.

- "My story fails with an URL reload loop error. **Why?**" → "Why does my story fail with an URL reload loop error?" (#846)
- "How to update the SSO certificate?" → "How do I update the SSO certificate?" (#740)
- "I hit the error <code>Could not retrieve repository ID</code> when trying to link a repo." → "Why am I getting <code>Could not retrieve repository ID</code> error when trying to link a repository?" (#630)
- "Why are styles not applied?" → "Why are styles not applied correctly in stories?" (#547)
- "Can I use a Storybook build in development mode to build Chromatic?" → "Can I use my Storybook in development mode to run a Chromatic build?" (#461)

**Use `<code>` for inline code inside `<summary>` and in titles.** Markdown backticks don't always render inside HTML tags. Keep the frontmatter `title` free of formatting.

**The `section` frontmatter field must be one of the keys listed in `src/content/troubleshooting/faq.mdx`** (`props.groupedFAQs.<key>`), spelled exactly, for example `turboSnap`, not `TurboSnap`. Pick the section a reader would browse to. Past fixes include `ci`→`usage`, `account`→`turbosnap`, and `publish`→`usage`.

**Answer first.** The first sentence answers the question ("No, …", "Yes, …", "Chromatic …"). Explanation and caveats follow.

**Split a multi-topic answer into `##` sections.** Use one section per concept or task.

- "There are **infrastructure** builds, **local** builds, and **standard** builds." → `## Standard build` / `## Infrastructure build` / `## Local build` (#525)

## 4. Lists, steps, tables, and structure

**Sequential prose becomes a numbered list.** Three paragraphs of "Navigate to… Click… Select…" become `1.` `2.` `3.` with no blank lines between items (#483). Indent images under the list item they belong to.

**UI steps name the screen, then the controls in click order, with exact UI labels in bold.** Use `»` for menu paths, and the verbs "Go to", "Select", and "click".

- "1. Go to **Account settings » Teams**. 2. Select the team, then under **Projects** click **Add project**…" (#883)
- Use the label exactly as it appears in the product: "Shared with Me" → "Shared with you" (#501)

**Short lists can be prose.** A two-bullet list after "If so:" reads better as one sentence (#658, #879).

**Tables:** merge redundant columns (`Scope` + `Persistence` → `Scope & Persistence`, #879), keep cell punctuation consistent, and use one status emoji family consistently (🟢 🟡 🔴).

**Turn a one-line summary of roles or options into a reference table** when readers need to compare them. Bold the names and add a "what they can do" column (#883).

**Callouts and disclosure:**

- `<div class="aside">` is for a tip or caveat the reader might miss. Leave a blank line after the opening tag, and don't indent the contents, or the markdown won't render (#412, #348). Important caveats can go right under the intro paragraph (#581).
- `<details><summary>` is for optional depth such as long prompts, edge cases, or FAQ answers on feature pages (#803).

**Don't repeat what exists elsewhere.** Link to it. If a PR duplicates an existing section, flag it as a placement question rather than editing it.

## 5. Links

**Internal links are relative: `/docs/<slug>` or `/docs/<slug>#anchor`.** Don't put a slash before `#`, and never use absolute `https://www.chromatic.com/docs/...` URLs.

- `/docs/turbosnap/setup/#github-…` → `/docs/turbosnap/setup#github-…` (#762)
- `https://www.chromatic.com/docs/manual-ui-review/` → `[manual UI Review](/docs/manual-ui-review)` (#468)

**Use descriptive link text, not bare URLs.** "You can learn more about this here: https://…" → "…in [Run Chromatic on large projects](/docs/github-actions#run-chromatic-on-large-projects)." (#512)

**Make "see step 3" a real anchor link**, and when a heading changes, fix every anchor that pointed to it (#883). Anchors are generated from heading text, so renaming a heading breaks its inbound links. `grep -rn '#<old-anchor>' src/content` finds them.

**Link third-party tools, product screens, and settings on first mention.** Examples: `shadow-dom-testing-library` (#673), `tj-actions/changed-files` (#409), Gravatar (#476), and the Notifications page (#508).

**Email addresses use `mailto:`.** `[support@chromatic.com](mailto:support@chromatic.com)`.

## 6. Code blocks

**Put the filename in the fence's `title` attribute**, not in a comment on the first line or in the sentence before the block.

- "`json" + "// package.json" → "`json title=\"package.json\"" (#658)
- "Create a bash script under ./tools/skip-unaffected.sh that contains" → "Create the `skip-unaffected.sh` bash script that contains" with `title="./tools/skip-unaffected.sh"` (#759)

**Shell blocks contain only commands someone can run.** Instructions like "# fork this repository" go in the prose above the block (learnstorybook #564).

**Examples are complete.** Replace `# TODO` placeholders, include the install step a reader needs ("Install shadow-dom-testing-library and then in your preview file…", #673), and make JSON and YAML valid with 2-space indentation (#658).

**CI examples stay consistent across providers.** The workflow file is `.github/workflows/chromatic.yml`, the Chromatic step is named `Run Chromatic`, and job, stage, and step names match across GitHub Actions, GitLab, CircleCI, and Jenkins (#796, #409).

If Prettier mangles an MDX component, wrap it in `{/* prettier-ignore-start */}` … `{/* prettier-ignore-end */}` (#674).

## 7. Terminology

These are swaps the docs lead has enforced, checked against current usage in `src/content/`. For snapshot, billing, and TurboSnap terms, run the `snapshot-terminology-check` skill. It owns that vocabulary.

| Use                                                                                | Not                            |
| ---------------------------------------------------------------------------------- | ------------------------------ |
| allowlist                                                                          | whitelist (also in file names) |
| Git provider, Git account, Git history                                             | git provider, Git user         |
| repository                                                                         | repo (in prose)                |
| Chromatic web app                                                                  | the app                        |
| Chromatic organization account                                                     | Chromatic entity               |
| UI Review (capital R), UI Tests                                                    | UI review, UI reviews          |
| TurboSnap                                                                          | Turbosnap, Turbo Snap          |
| interaction test (lowercase)                                                       | Interaction test               |
| assertion                                                                          | expression (in a test)         |
| capture snapshots                                                                  | take snapshots                 |
| Storybook 7 and lower                                                              | SB < v8                        |
| Chrome DevTools                                                                    | Chrome Devtools                |
| Playwright and Cypress, when the sentence is about those two integrations          | E2E integration                |
| Flake Filter (feature); "ignore" a test                                            | manual ignore, manually ignore |
| the exact on-screen label, in bold                                                 | a paraphrase of the label      |
| a component name (Button) as a plain capitalized word, when it names the component | `button`                       |
