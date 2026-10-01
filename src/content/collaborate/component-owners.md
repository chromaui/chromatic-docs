---
title: Component and story owners
description: Automatically assign the right reviewers to a UI Review based on which components and stories changed, using a COMPONENTOWNERS file.
sidebar: { order: 2, label: 'Component owners' }
---

# Component and story owners

In a large Storybook, different people own different parts of the UI. A design system lead owns the form controls, another engineer owns navigation, and so on. When a pull request changes those areas, the people who own them should be the ones reviewing the changes. Assigning those reviewers by hand is slow and easy to get wrong, and [default reviewers](/docs/review#default-reviewers) apply to every Review regardless of what changed.

Component owners solve this. You list who owns which components and stories in a `COMPONENTOWNERS` file. When Chromatic creates a [UI Review](/docs/review), it checks the stories in the changeset against that file and automatically assigns their owners as reviewers.

<!-- IMAGE PLACEHOLDER: A UI Review with reviewers automatically assigned from COMPONENTOWNERS -->

## Create a COMPONENTOWNERS file

`COMPONENTOWNERS` is a plain text file that works like a Git provider's `CODEOWNERS` file. Each line is a rule: a path pattern followed by one or more owners.

```text title="COMPONENTOWNERS"
<path-pattern> <owner> [<owner> ...]
```

Lines starting with `#` are comments, and blank lines are ignored.

<!-- TODO: Document where the COMPONENTOWNERS file lives and how the Chromatic CLI uploads it once that's finalized. -->

Here's an example:

```text title="COMPONENTOWNERS"
# Fallback owner for every story (must come first)
*                         frontend-lead@acme.com

# Design system
Forms/*                   bob@acme.com alice@acme.com
Forms/Input               bob@acme.com

# Navigation and layout
Layout/*                  carol@acme.com

# Story-level override
Forms/Input/Primary       design-system-lead@acme.com
```

### Path patterns

Patterns match against a story's Storybook path (its `title` followed by the story name), not the file path of the story file. For example, the `Primary` story of a component titled `Forms/Input` has the path `Forms/Input/Primary`.

| Pattern               | Matches                                    |
| --------------------- | ------------------------------------------ |
| `*`                   | Every story                                |
| `Forms/*`             | Every story under `Forms`, at any depth    |
| `Forms/Input`         | Every story of the `Forms/Input` component |
| `Forms/Input/Primary` | Only the `Primary` story of `Forms/Input`  |

### Owners

Identify each owner by the email address of their Chromatic account, without an `@` prefix (for example, `alice@acme.com`). This works for every user, whether they sign in with a Git provider, email, or SSO.

A rule can list several owners, separated by spaces. When a rule applies, all of its owners are assigned.

<div class="aside">

ℹ️ Teams and Git provider usernames (for example, `@alice` on GitHub) aren't supported. List each person's email address instead.

</div>

### Rule precedence

As with `CODEOWNERS`, the **last matching rule wins**. When several rules match a story, only the owners on the last matching rule in the file are assigned.

This means general rules go at the top and specific rules go below them. In the example above:

- `Layout/Header/Default` is assigned to `carol@acme.com`.
- `Forms/Select/Default` is assigned to `bob@acme.com` and `alice@acme.com`.
- `Forms/Input/Default` is assigned only to `bob@acme.com`, because `Forms/Input` comes after `Forms/*`.
- `Forms/Input/Primary` is assigned only to `design-system-lead@acme.com`, because the story-level override is the last matching rule.

<div class="aside">

⚠️ Put the catch-all `*` rule at the top of the file. If it's the last line, it will match every story and override all the rules above it.

</div>

## How owners are assigned

When Chromatic creates a UI Review, it looks at each story with changes in the changeset, finds the last matching rule in `COMPONENTOWNERS`, and assigns those owners as reviewers. Owners are added alongside your project's [default reviewers](/docs/review#default-reviewers).

<!-- IMAGE PLACEHOLDER: Reviewers list on a UI Review showing owners assigned from COMPONENTOWNERS -->

Assigned owners behave like any other reviewer. They're notified about the Review, and every assigned reviewer must approve for the Review to pass. You can still add or remove reviewers on an individual Review.

<!-- IMAGE PLACEHOLDER: Manage page Review section with component owners information -->

## Troubleshooting

Chromatic doesn't validate the `COMPONENTOWNERS` file. If an owner isn't being assigned, check that:

- The email address matches the one on the person's Chromatic account, and they're a collaborator on the project.
- The pattern matches the story's Storybook path, not its file path.
- A later rule in the file doesn't also match the story and override the rule you expect.
- The owner has notifications turned on in their [notification settings](/docs/notifications) if they aren't receiving emails.
