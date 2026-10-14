---
name: dx-review
description: Review a teammate's Chromatic docs pull request the way the docs lead does, then act on it. Pushes a "copy edits" commit with house-style fixes onto the author's branch, asks the clarifying and accuracy questions as inline comments, and posts an approve or comment review in a short, warm voice. Use whenever the user asks to review, check, edit, approve or "take a pass at" a chromatic-docs PR (a number, a URL, or "the open PRs"), says "dx-review", or wants feedback on someone else's docs changes under src/content/, even if they only say "can you look at #923".
---

# DX review

Review someone else's docs PR in `chromaui/chromatic-docs` and finish the job: fix the copy yourself, ask about what you can't fix, and post the review. This reproduces how the docs lead has reviewed ~300 docs PRs. Most get approved with a short thanks. About a quarter get a commit of copy edits pushed straight to the author's branch, and some get pointed questions when the content is unclear or wrong.

The scope is **docs prose**: Markdown and MDX under `src/content/`, plus frontmatter, images, and code samples inside those pages. If the PR only changes components, config, or tooling, say it's outside this skill's scope and stop.

## The two kinds of feedback

Every issue you find is one of two kinds. Sorting them correctly is the most important judgment in this skill.

**Fix it yourself (copy edits).** Anything where the author's intent is clear and your edit keeps the facts the same: wordiness, heading style, FAQ question form, sentence case, link format, list structure, terminology, frontmatter fields, code-fence titles, em dashes. The author shouldn't have to do a round trip for these, and a comment saying "please reword this" costs more than the edit. Push these as a commit.

**Ask about it (questions).** Anything where you'd have to guess what the author meant or what's true:

- **Undefined terms.** "What is a 'Chromatic entity'?", "Could you explain here what a 'fractional element' means?", "What is module A? I don't see it described below."
- **A missing next step.** The page describes a problem but not what the reader should do. "If it is, then what should the user do?"
- **A missing example** where a concept is abstract. "Can we show an example?", "Could you share an example of how `--untraced` will be used?"
- **Technical claims you can't verify,** or that conflict with how Chromatic works. "Why would test addon or Test Runner impact how Chromatic runs the story? Chromatic doesn't use either of those tools." Check the rest of `src/content/` first. If existing docs contradict the claim, say so and link them.
- **Advice that makes readers change app code just for a test,** when a story-level fix exists (a decorator, a parameter, a play function). Suggest the alternative.
- **Deleted content.** When a PR removes explanations or sections that weren't moved elsewhere, ask why. Link the deploy preview and production pages side by side so the author can compare: `https://deploy-preview-<N>--chromatic-docs.netlify.app/docs/<slug>` and `https://www.chromatic.com/docs/<slug>`.
- **Placement.** The content belongs on another page or section. Examples: a Playwright-only technique proposed as a general page, a FAQ that duplicates a feature page, or a guide that overlaps existing TurboSnap docs. Propose where it should go and why. Don't move content across pages in your commit. That's a bigger change than a copy edit, and the author may have context you don't.

Never rewrite a technical claim into something you believe is more correct and push it. If the fact is in question, ask. Your copy edits must leave the PR saying the same things, just better.

## Workflow

### 1. Load the PR

```bash
gh pr view <N> --json number,title,body,author,state,isDraft,headRefName,headRepositoryOwner,isCrossRepository,maintainerCanModify,baseRefName,files,url
gh pr diff <N>
```

Stop and tell the user if the PR is merged, closed, or authored by the user themselves, unless they asked for a dry run at a specific commit (below). You can't approve your own PR, and editing your own PR isn't a review. For a draft PR, review it but post as a comment, not an approval.

Check the PR out in a separate worktree so the user's working tree is untouched:

```bash
WT=<scratchpad>/pr-<N>
git worktree add --detach "$WT" origin/main
cd "$WT" && gh pr checkout <N>
```

`gh pr checkout` sets up the push remote for forks too.

**Reviewing as of a specific commit** (the user names a SHA, usually for a dry run, and this also works on merged PRs): `git fetch origin pull/<N>/head`, then `git worktree add --detach "$WT" <sha>`. Take the diff from git rather than `gh pr diff`, which shows the PR's final state: `git diff $(git merge-base <sha> origin/<baseRefName>)..<sha>`. In this mode, don't read the PR's later commits, comments, or reviews, and read file contents from the worktree, not the main checkout. Both reflect changes made after the commit you're reviewing.

### 2. Read in context, not just the diff

For each changed page, read the **whole file** and its sidebar neighbours in the same collection. Most placement and duplication problems are invisible in the diff. Also `grep -ril` the PR's key terms across `src/content/` to find pages that already cover the topic or that the PR contradicts.

Look at what was removed as carefully as what was added. A diff that drops more lines than it adds deserves a check that nothing important went with them.

### 3. Review

Go through `references/house-style.md` for the copy edits. It's the style the docs lead enforces, with real before/after examples from past PRs. Apply its rules to the lines this PR added or changed. Leave pre-existing text alone unless it sits inside a paragraph you're already rewriting. A review that rewrites untouched sections makes the PR hard to read and isn't what the author asked for.

Then make the question pass from the section above. Write each question as an inline comment on the exact line.

Run the sibling checks when they apply:

- **`snapshot-terminology-check`** if the changed lines mention snapshots, TurboSnap, billing, usage, or plan limits. Judge only the PR's lines.
- **`docs-link-check`** if the PR adds or changes links, renames headings, or moves or renames pages. It needs `pnpm install` in the worktree first. A broken link is a copy edit if the right target is obvious, otherwise a question.

PR hygiene, flagged in a comment rather than fixed: a `package-lock.json` or `yarn.lock` in the diff (this repo uses pnpm, so ask them to remove it and use `pnpm install`), images that were added but aren't referenced, and stray temp files.

### 4. Push the copy edits

Make the edits in the worktree. Then **proofread your own diff** (`git diff`). Quick edits tend to introduce typos, half-deleted sentences ("billed at the copied at the rate of"), broken list numbering, and dropped table cells. Every changed line should read cleanly on its own.

Run `pnpm exec prettier --check` on the changed files if `node_modules` exists, and fix anything it flags.

```bash
git add -A src/content && git commit -m "copy edits"
git push
```

Keep the commit message as plain "copy edits" (add a second line only if you moved something within a page). Never force-push, rebase, or squash the author's commits. Your commit goes on top.

If you can't push (a fork with `maintainerCanModify: false`, or the push is rejected), fall back to GitHub `suggestion` blocks. Post each edit as an inline comment with a ```suggestion fenced block replacing those exact lines, so the author can apply it in one click.

### 5. Post the review

Decide the verdict:

| Situation                                                                                                | Event             | Body                                                                                 |
| -------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| No questions, or only copy edits you pushed                                                              | `APPROVE`         | Short thanks, plus a note on the edits                                               |
| Minor non-blocking question or suggestion                                                                | `APPROVE`         | "One suggestion, but I'll approve to unblock you"                                    |
| Questions whose answers change what readers would do, a claim that looks wrong, or unexplained deletions | `REQUEST_CHANGES` | "This is great. I just need to clarify a couple of things before we can merge this." |
| Draft PR, or only open-ended discussion                                                                  | `COMMENT`         |                                                                                      |

Post the review with its inline comments in one call. Write the payload to a file in the scratchpad. Bodies with backticks break inline quoting.

```bash
HEAD_SHA=$(git rev-parse HEAD)   # after your push, so line numbers match
cat > <scratchpad>/review-<N>.json <<'EOF'
{ "commit_id": "<HEAD_SHA>", "event": "APPROVE", "body": "...",
  "comments": [ { "path": "src/content/...", "line": 42, "side": "RIGHT", "body": "..." } ] }
EOF
gh api repos/chromaui/chromatic-docs/pulls/<N>/reviews --input <scratchpad>/review-<N>.json
```

Inline `line` numbers refer to the file at `HEAD_SHA`, and the line must be part of the PR's diff. For a multi-line range, add `start_line`. Don't merge the PR, even when approving. Merging is the author's call, or the user's.

Clean up with `git worktree remove "$WT"` when done.

### 6. Report back

Tell the user, in a few lines: the verdict posted, how many copy edits you pushed and what kinds (headings, FAQ titles, links…), the questions you asked, and links to the review and the commit. Also mention anything you deliberately left alone, such as pre-existing issues outside the diff or a placement change you proposed but didn't make.

**Dry run.** When the user asks to only draft, or says not to post or push, do steps 1–4 without the push, and step 5 without the API call. Save `review.md` (verdict, body, and each inline comment with its file and line) and `copy-edits.patch` (`git diff`) and show them to the user.

## Voice

Review comments sound like a colleague, not a linter. They are short and specific, often a single sentence, sometimes lowercase. Address the author by handle when asking them to do something. Be warm without gushing. Don't write headings, bullet-point summaries, or an "Overall…" paragraph in review bodies.

Real examples to calibrate against:

- Approvals: "Thanks!", "This is great, thank you!", "Thanks, this is super helpful", "Good spot, thanks!", "This is fantastic, thanks @repomadness"
- After pushing edits: "@cgbl-90 I made some edits, LMK if they look okay to you", "Made some edits and moved it to the turbosnap section", "Made a few tweaks to use the term `allowlist` instead of `whitelist`"
- Questions: "@cgbl-90 what is a \"Chromatic entity\"?", "If it is, then what should the user do?", "@domyen why was this deleted? I don't see it moved to a different page.", "Could you explain here what a \"fractional element\" means. Maybe even put that in the title"
- Pushback: "This is asking the user to modify their app code for a test which is not ideal. Could they wrap the component in a decorator with a `div` that sets `display: initial`?"
- Placement: "since this is so playwright specific, what do you think about adding a page under playwright section?", "there seems to be a bit of overlap with the stuff you added previously. Also, does it make sense to keep this under the turbosnap section instead of guides?"

When the edits you pushed include something the author might not expect (a terminology swap, a retitled page), name it in one clause so they aren't surprised: "Pushed some copy edits. Mostly headings and FAQ titles, and I switched `whitelist` to `allowlist`. LMK if they look okay."
