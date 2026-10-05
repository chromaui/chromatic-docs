---
title: Component and story owners
description: Use a COMPONENTOWNERS file to automatically assign the right reviewers to a UI Review based on which components and stories changed.
sidebar: { order: 2, label: 'Component owners' }
---

# Component and story owners (beta)

In large codebases, no one person owns the whole UI. When a pull request touches a component, the person who owns it should review it, not whoever happened to get tagged. Component owners maps parts of your UI to the people responsible for them, so the right reviewers are added to the [UI Review](/docs/review) automatically.

![Chromatic matches the changed stories in Build 482 (Input-Primary, Select-Default and Header-Default) against the rules in a COMPONENTOWNERS file, then adds the matching owners (dom@acme.com, michael@acme.com and varun@acme.com) as reviewers on the UI Review.](../../images/component-owners.png)

## How to set up component owners

Chromatic reads a `COMPONENTOWNERS` file to decide who reviews each changed story. It's a plain text file that works like a Git provider's `CODEOWNERS` file.

<div class="aside">⚠️ Component owners requires Chromatic CLI 18.8.0 or later.</div>

### Create a COMPONENTOWNERS file

Add a file named `COMPONENTOWNERS` to the root of your repository. Each line is a rule: a path pattern followed by one or more owners.

```text title="COMPONENTOWNERS"
<path-pattern> <owner> [<owner> ...]
```

Lines starting with `#` are comments, and blank lines are ignored.

#### Path patterns

Patterns match against a story's Storybook path (its `title` followed by the story name), not the path of the stories file. For example, the `Primary` story of a component titled `Forms/Input` has the path `Forms/Input/Primary`.

| Pattern               | Matches                                    |
| --------------------- | ------------------------------------------ |
| `*`                   | Every story                                |
| `Forms/*`             | Every story under `Forms`, at any depth    |
| `Forms/Input`         | Every story of the `Forms/Input` component |
| `Forms/Input/Primary` | Only the `Primary` story of `Forms/Input`  |

#### Owners

List each owner by the email address associated with their Chromatic account. A rule can list several owners, separated by spaces. When a rule matches, all of its owners are assigned.

#### Example

```text title="COMPONENTOWNERS"
# Fallback owner for every story (must come first)
*                         kyle@acme.com

# Design system
Forms/*                   dom@acme.com varun@acme.com
Forms/Input               dom@acme.com

# Navigation and layout
Layout/*                  michael@acme.com

# Story-level override
Forms/Input/Primary       varun@acme.com
```

### Rule precedence

As with `CODEOWNERS`, the **last matching rule wins**. When several rules match a story, only the owners on the last matching rule in the file are assigned. Therefore, put general rules at the top and specific rules below them.

In the example above:

- `Layout/Header/Default` is assigned to `michael@acme.com`.
- `Forms/Select/Default` is assigned to `dom@acme.com` and `varun@acme.com`.
- `Forms/Input/Default` is assigned only to `dom@acme.com`, because `Forms/Input` comes after `Forms/*`.
- `Forms/Input/Primary` is assigned only to `varun@acme.com`, because the story-level override is the last matching rule.

<div class="aside">

⚠️ Put the catch-all `*` rule at the top of the file. If it's the last line, it matches every story and overrides all the rules above it.

</div>

## Owners are assigned after a build is completed

When Chromatic creates a UI Review, it takes each changed story in the changeset, finds the last matching rule in `COMPONENTOWNERS`, and assigns those owners as reviewers. Owners are added alongside your project's [default reviewers](/docs/review#default-reviewers).

<!-- IMAGE PLACEHOLDER: Reviewers list on a UI Review showing owners assigned from COMPONENTOWNERS -->

Assigned owners behave like any other reviewer. They're notified about the Review, and every assigned reviewer must approve for the Review to pass. You can still add or remove reviewers on an individual Review.

![UI Review showing owners assigned from COMPONENTOWNERS](../../images/component-owners-assigned.png)

## Troubleshooting

<details>
<summary>Does Chromatic validate the COMPONENTOWNERS file?</summary>

No. Chromatic doesn't check the file for errors. A malformed rule, a mistyped email, or a pattern that matches no stories is silently ignored, so double-check the file when you add or change rules.

</details>

<details>
<summary>Why isn't a component owner being assigned?</summary>

Check the following:

- Your project runs Chromatic CLI 18.8.0 or later.
- The email address matches the one on the person's Chromatic account, and they're a collaborator on the project.
- The pattern matches the story's Storybook path, not its file path.
- A later rule in the file doesn't also match the story and override the rule you expect.

If an owner is assigned but isn't receiving emails, ask them to check their [notification settings](/docs/notifications).

</details>

<details>
<summary>How do component owners work in a monorepo with multiple projects?</summary>

All projects in the repository share one `COMPONENTOWNERS` file. If several Storybooks have stories at the same path, a rule for that path assigns its owners in every one of those projects.

To keep ownership separate, namespace each Storybook's stories with a unique top-level title (for example, `Marketing/Button` and `App/Button` instead of `Button` in both), then write rules against those namespaces.

</details>

<details>
<summary>Can I remove a component owner from a UI Review after they're assigned?</summary>

Yes. Assigned owners are regular reviewers, so you can remove them from an individual Review the same way you remove any other reviewer.

</details>
