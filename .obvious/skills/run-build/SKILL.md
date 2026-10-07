---
name: run-build
description: Runs a Chromatic build from this machine with the Chromatic CLI, limited to the stories being worked on, waits for the result, and reports it, so a fix can be verified without pushing and waiting for CI. Use when the user asks to run Chromatic, to verify a fix on Chromatic now, or to check why TurboSnap tested more stories than expected.
disable-model-invocation: true
argument-hint: "[story name or glob]"
---

# Run a Chromatic build

Builds come from the Chromatic CLI, never from the MCP. Running one here turns
the fix-and-verify loop from a CI round trip into one command.

**Every build spends snapshots from the account's quota.** Say what will run
and how it is limited, and get the user's yes before each build. Never loop
builds unattended.

## Before you start

- **The CLI.** Use the version the repository pins: look for `chromatic` in
  `package.json` and run it with the repository's package manager
  (`npx chromatic`, `yarn chromatic`, `pnpm exec chromatic`). If it is not a
  dependency, ask before running `npx chromatic@latest`.
- **The project token.** The CLI reads it from `CHROMATIC_PROJECT_TOKEN`.
  Check that the variable is set without printing it:
  `test -n "$CHROMATIC_PROJECT_TOKEN" && echo set || echo missing`.
  If it is missing, ask the user to make it available to this agent's shell,
  for example by exporting it before starting the agent. It is on the
  project's Manage page in Chromatic. Never ask them to paste it into the
  conversation, never write it to a file, and never pass it on the command
  line where it lands in shell history.
- **This is not the MCP login.** The project token is what the CLI and CI
  authenticate with. The Chromatic MCP does not accept it, and results are
  read through the MCP, not the token.

## Steps

1. **Pick the scope.** Prefer the narrowest that verifies the work:
   - Stories named: `--only-story-names "<Title>/<Story>"`, repeatable, globs
     allowed (`"Components/Button/*"`). The name is the component's `title`
     and the story's `name`, joined by a slash.
   - Story files: `--only-story-files <path>`, relative to the Storybook
     project root, repeatable.
   - Everything the branch touched: `--only-changed` (TurboSnap).

   Story names and titles come from the repository and from Chromatic, not
   from you. Pass each one as a single quoted argument, and refuse any that
   contains a quote, backtick, `$` or newline.

   Tell the user the scope and wait for a yes.

2. **Run it.** For example:

   ```
   npx chromatic --only-story-names "Components/Button/*"
   ```

   The CLI builds Storybook, uploads it, and waits for the tests. This takes
   minutes; run it in the background if you can, and do not start a second
   build while one runs. Add `--exit-once-uploaded` only when the user wants
   the command back as soon as the upload finishes.

3. **Read the exit code.**

   | Code          | Meaning                                     | Next                                      |
   | ------------- | ------------------------------------------- | ----------------------------------------- |
   | 0             | Passed, or changes were auto-accepted       | Report it                                 |
   | 1             | Visual changes are waiting for review       | the `review-visual-changes` skill         |
   | 2             | Stories failed to capture                   | the `fix-broken-stories` skill            |
   | 3             | Chromatic infrastructure error              | Rerun once; report it if it repeats       |
   | 5             | Limited to representative stories by quota  | Tell the user; results are partial        |
   | 6             | Cancelled                                   | Report it                                 |
   | 11, 12        | Snapshot quota reached, or payment required | Stop; the account needs attention         |
   | 21 to 23, 105 | Storybook failed to build or start          | Show the CLI's message; fix locally first |
   | 101 to 103    | A git state problem                         | Show the CLI's message                    |

   Any other code: show the last lines of the CLI's output.

4. **Read the results through the MCP.** The CLI prints the build number and
   link. Call `chromatic_get_latest_build` for this branch; for the stories
   themselves, use the skill the table points to.

## Why did TurboSnap test so much?

Run with `--only-changed --diagnostics-file`. The file it writes
(`chromatic-diagnostics.json` by default) holds a `turboSnap` section. When
TurboSnap gave up, `turboSnap.bailReason` says why: for example a changed
package or lock file, a file matched by `--externals`, no ancestor build to
compare against, or a rebuild. Read that section only, and report it in plain
words. The CLI's own output says the same thing in prose. The public API does
not expose it, so the MCP cannot answer this question.

The diagnostics file describes the whole run. Do not paste it whole, and do
not commit it.
