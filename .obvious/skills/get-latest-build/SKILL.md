---
name: get-latest-build
description: Reports the latest Chromatic build for this repository's project, on the current branch unless another is named. Use when the user asks what Chromatic thinks of their branch, whether the build passed or is still running, or for the build id the accessibility tools need.
argument-hint: "[branch]"
---

# Latest Chromatic build

Answer "what is the state of my branch on Chromatic?" with one tool call.

## Steps

1. Get the project id from `chromatic.config.json` at the repository root. If
   the file is missing or has no `projectId`, follow the `connect-project`
   skill first, then return here.
2. Pick the branch: the one the user named when invoking this skill, otherwise
   the output of `git branch --show-current`.
3. Call `chromatic_get_latest_build` with `projectId` and `branches` set to
   `[<branch>]`.
4. If no build matches, call again without `branches`, say plainly that the
   branch has no build yet, and report the project's latest build instead.
5. Report the build number, status, result, the branch and commit it was built
   from, the change and awaiting-review counts, and `webUrl`. If
   `isSuperseded` is true, say a newer build exists. If the build is still in
   progress, say so rather than reading results into it.

Explain the status in one sentence, with what to do next, from
[references/build-states.md](references/build-states.md).

This reports the build, not its test results. For those, follow the skill the
status points to, or the `fix-accessibility-violations` skill for
accessibility. To look a build up by its number, use the `query-chromatic`
skill.
