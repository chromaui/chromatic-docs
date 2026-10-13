---
name: document-feature
description: End-to-end workflow for documenting a new or changed Chromatic feature in this docs repo, from a feature brief and Figma designs to a draft PR. Use whenever the user describes a feature (what it does, why, how it works), shares a Figma file of UI changes, and wants docs written or updated, including "document this feature", "write docs for X", "update the docs for the new Y", "we shipped Z, can you add it to the docs", or a pasted spec or release note plus a figma.com link. Covers choosing where the docs go, writing the page, building images with docs-images, reviewing, and opening a draft PR.
---

# Document a feature

Turn a feature brief and its Figma designs into published-ready docs: the right page, accurate prose, matching images, reviewed, and up as a draft PR.

The user supplies the inputs, usually pasted into the prompt:

- **Purpose:** what problem the feature solves and who it's for.
- **Functionality:** how it works, settings, limits, plan availability, rollout status.
- **Figma file** with the UI changes.

The brief and the Figma file are the only sources of truth. The docs will be read by customers who act on them, so a confident sentence that's wrong is worse than a gap. When the brief doesn't say something, don't fill it in from what similar features do. Ask, or leave it out and list it as an open question.

## 1. Understand the feature

Read the brief, then look at the Figma designs (`get_metadata` to find the frames, `get_screenshot` on the relevant ones; load `figma-use` first if you'll call `use_figma`). From the designs, note:

- The exact UI labels: button text, menu items, setting names, status badges. Docs should use the same words the reader will see on screen, in **bold**.
- Where the feature lives: which screen, which panel, how you get there.
- The states: empty, enabled, error, the before/after of any change.

Then write down what you still don't know. Common gaps: which plans have it, whether it's beta or behind a flag, defaults, limits, CLI or config equivalents, what happens to existing data, permissions (who can change it). If a gap blocks the docs (you can't explain how to turn it on), ask the user now. If it's a detail, carry it as an open question into the PR description.

## 2. Decide where the docs go

Search before writing. `grep -ril` for the feature name, its UI labels, and related concepts across `src/content/`. Read the pages that come up, plus the sidebar neighbours in the collection the feature most likely belongs to. Docs readers navigate by task, so the question is "where would someone look for this?", not "where is there space?".

Options, roughly from smallest to largest:

| Situation                                              | Format                                                                      |
| ------------------------------------------------------ | --------------------------------------------------------------------------- |
| A change to something already documented               | Edit the existing section in place; update its images                       |
| A new capability of an existing feature                | New `##` section on that feature's page                                     |
| A standalone feature with its own setup and workflow   | New page in the collection it belongs to (`src/content/<collection>/`)      |
| A fix, error, or "why does X happen" answer            | Entry in `src/content/troubleshooting/` (uses `section` and `sectionOrder`) |
| A page that should exist but not appear in the sidebar | `src/content/notInNavigation/`                                              |

Also list the pages that should link to the new content (the parent feature page, overview pages, related troubleshooting), and any existing text the feature makes wrong (old screenshots, "this isn't supported yet", changed defaults).

**Show the user the plan before writing**: files to create or edit, the outline (headings), the images you intend to build (one line each: what it shows, crop vs full screen), cross-links, and the open questions. Placement is the decision that's most expensive to undo after review, so a 30-second confirmation here is worth it.

## 3. Write

Match the surrounding pages. Read one or two neighbours in the same collection and copy their shape: frontmatter fields, heading depth, how they introduce steps, how long sections run.

**Page skeleton** (new page):

```mdx
---
title: Feature Name
description: One sentence on what the reader can do with it
sidebar: { order: 5, label: 'Short Label' }
---

# Feature Name

One or two paragraphs: what it is and why you'd use it. Lead with the reader's problem, not the product.

![Alt text that says what the image shows](../../images/feature-screen.png)

## Enable / Set up …

## Use …

## Limitations / FAQ (only if there are real ones)
```

- Imports go between the frontmatter and the `# H1`.
- Set `sidebar.order` relative to the neighbours so it lands where you planned. Check their values.
- Internal links use the derived slug: `/docs/<page-slug>` and `/docs/<page-slug>#<heading-anchor>`, never file paths.
- Callouts are `<div class="aside">…</div>`. Use them for a tip or caveat the reader could otherwise miss, not for core steps.
- Steps that happen in the UI: name the screen, then the control in bold, in the order the reader clicks. "Go to your project's **Manage** screen, open **Collaborators**, and click **Invite**."
- Images sit right after the sentence they illustrate, with alt text that describes what the image shows and why it matters. Use the frame name you'll give it in Figma: `../../images/<frame-name>.png`.
- Write in second person, present tense, plain words. Keep em dashes out of sentences (use a period, comma, colon, or parentheses). Em dashes are fine in structured `label — definition` lines and tables.
- If a page is moved or renamed, add a redirect in `_site_deploy/_redirects` (`/docs/old/ /docs/new/`).

Keep claims sourced. If you find yourself writing a default value, a limit, or a plan name that isn't in the brief or the designs, stop and move it to the open questions.

## 4. Build the images

Use the **`docs-images`** skill for every image in the plan. It owns the Figma file, frame naming, composition, and export rules, so follow it rather than improvising. Two things this workflow adds:

- **The feature's Figma file is the reference for new UI.** `docs-images` asks for a design when the control isn't in the library yet. Point it at the frames from step 1 so it can rebuild the new UI from them (or copy the relevant layers) instead of inventing it.
- **Section:** use the docs-images section that matches the page you're writing. If none fits, propose a new section named for the docs topic and confirm with the user.

Make sure each exported filename matches the path already written into the page. Build the images after the prose so you know exactly which steps need a picture. Usually that's one image per major step or concept, not one per paragraph.

## 5. Review

Run these, fix what they find, and re-run until clean:

1. **`docs-link-check`** for every page you added or edited. It catches broken slugs and anchors in unmerged changes.
2. **`snapshot-terminology-check`** if the page mentions snapshots, captures, TurboSnap, billing, usage, or plan limits.
3. **Prose pass** with `humanizer` on the new and changed text: cut filler, promotional tone, and AI tells. Keep the facts and UI labels untouched.
4. **Accuracy pass** (yourself): reread the changed text against the brief and the Figma frames. Every UI label should match the design exactly. Every default, limit, and plan claim should trace to the brief. Every image referenced should exist at its path. Anything that doesn't trace goes to open questions or gets cut.
5. Start `pnpm dev` and open the page at `http://localhost:4321/docs/<slug>` to check the sidebar position, image rendering, and callouts. Stop the server afterwards.

## 6. Open a draft PR

1. If you're on `main`, create a branch first: `docs/<feature-slug>`.
2. Commit the content, images, and any redirect with a conventional message, e.g. `docs: document <feature>`, and a body that says what pages changed.
3. Use the **`create-pr`** skill to open a draft PR. In the description include:
   - **Summary:** the feature in one sentence and the pages added or changed.
   - **Open questions** for the feature owner: every gap from step 1 and every claim you couldn't verify. Reviewers can answer these inline instead of reverse-engineering what's uncertain.
   - **How to QA:** the Netlify preview paths to check (`/docs/<slug>`), and what to look for.
   - The Figma links for the source designs and the new docs-image frames.
4. Give the user the PR link and the open questions.
