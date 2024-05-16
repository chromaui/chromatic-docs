---
layout: "../../layouts/Layout.astro"
title: Mandatory PR checks
description: Learn how to block pull requests that contain unapproved visual changes
sidebar: { order: 6 }
---

# Mandatory PR checks

When you link your Chromatic project to a GitHub, Bitbucket, or GitLab repository, Chromatic provides status checks directly on your pull requests. Depending on what features you have enabled, you'll see checks for: UI Tests, UI Review & Publish.

If Chromatic detects visual changes or if UI Review is required, the status checks will show as "pending." This indicates that a human needs to review the changes before proceeding.

You can add an additional layer of protection by requiring these checks to be mandatory. In other words, you will not be able to merge the pull request until all changes have been approved. This guarantees that no visual changes are merged without approval.

## Enable mandatory PR checks

Mandatory checks are a per-repository setting within your Git provider. The following steps show you how to require Chromatic checks to be mandatory on your pull requests:

### GitHub

For GitHub repositories, mandatory status checks are configured as branch protection rules. Here's how:

1. On GitHub.com, navigate to the main page of the repository.
2. Under your repository name, click **Settings**.
3. In the **Code and automation** section of the sidebar, click **Branches**.
4. Next to **Branch protection rules**, click **Add rule**.
5. Under **Branch name pattern**, type the branch name or pattern you want to protect. e.g., `main` or `*` to protect all branches.
6. Select **Require status checks to pass before merging**.
7. In the search field, search for status checks (e.g.: Chromatic, UI Test, UI Review, etc.), select the checks you want to require.
   ![](../../images/github-branch-protection-rules.png)
8. Click **Save changes**
9. Now all pull requests to the protected branch will require the Chromatic checks to pass before merging.
   ![](../../images/github-mandatory-checks.png)

### GitLab

### Bitbucket
