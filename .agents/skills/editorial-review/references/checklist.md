# Editorial checklist

Apply each category to every page in the set, in this order. Earlier categories hurt readers more: a contradiction sends someone down the wrong path, an inconsistent quote style just looks untidy.

Line-level copy edits (wordiness, heading case, FAQ question form, link format) are out of scope. They belong to `dx-review` and its `references/house-style.md`.

## 1. Contradictions and broken references across pages (group A)

- **Conflicting recommendations.** A page recommends a path another page in the set removed or replaced. Read each "use X when…" and "we recommend…" against the other pages.
- **Lost anchors.** A restructure removed an anchor other pages link to: a `<details id>` became a tab, a heading was renamed, an H3 was merged into its parent. `grep -rn '#<anchor>' src/content/` for every anchor that changed.
- **Mismatched link text.** The link text no longer matches the target's heading or what the target page now covers ("see [Service clients](/docs/…)" pointing at a page now titled "Personal access tokens").
- **Term collisions.** One word means two things on the same page, such as a section called "Other tools" on a page where "tools" means MCP tools.
- **Broken links** from `docs-link-check`.

## 2. Information architecture (group B)

- **Heading hierarchy.** The built TOC should let a reader jump to every task. A long page with only two or three H2s, or with key steps buried in H4s or `<details>`, needs its outline reworked.
- **Order.** Concept before procedure: "what it is" and "when to use it" before "how to install". Prerequisites before the steps that need them.
- **Sidebar position.** A page sits next to the pages a reader needs before and after it. Check `sidebar.order` and the collection folder.
- **Dead ends.** Every starting or overview page ends with a way forward. Every key page in the set is linked from the entry page.
- **Orphans.** A page in the set that nothing links to, and that the sidebar hides.

## 3. Single source of truth (group B)

- The same table, list, or paragraph appears on more than one page, or in both a section and an FAQ. Pick the owner (usually the most specific page), keep the content there, and replace the copies with a one-line summary and a link.
- When copies have drifted, list the differences in the finding. The merged version must keep every fact; call out any you'd drop.

## 4. Repetition within a page (group B)

- The same point made in the intro, a section, and a callout. Keep it where the reader needs it to act; cut or shorten the rest.
- Two sections that answer the same question under different headings.

## 5. Tone and claims (group C)

- **Marketing copy** in docs ("seamless", "powerful", benefit-led intros). Docs say what the thing does and how to use it.
- **Unsourced numbers** ("cuts review time by 40%"). Remove or ask for the source.
- **Time-sensitive statements** that will rot: version history ("added in 2.3"), "X can't do Y yet", "coming soon", "new". State current behaviour; leave history to the changelog.

## 6. Consistency (group C)

- **One term per concept.** Define it once, on first use or on its owner page, and use the same word everywhere in the set.
- **Spelling.** US English ("judgment", "behavior").
- **Mechanics.** One quote style, one callout component, one way of writing UI labels across the set.
- **Misplaced sentences.** A sentence that belongs to the next section, or to a different page.
- **Images vs prose.** Each screenshot shows what the text beside it describes: the same labels, the same step, the same state.
