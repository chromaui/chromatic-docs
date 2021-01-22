---
layout: default
title: Access control
description: Learn how to control who has access to your Chromatic project
---

# Access control

Learn how to manage access to your Chromatic account and projects.

## Authentication

Login via OAuth from GitHub, GitLab, or Bitbucket. Chromatic supports the public cloud versions of these services via our [self-serve plans](https://www.chromatic.com/pricing).

If you use the on-premise or enterprise versions of GitHub, GitLab, or Bitbucket, we can support you via our [enterprise plan](https://www.chromatic.com/pricing). The enterprise plan also offers single sign-on (SSO) and service-level agreements (SLA). We recommend trialing Chromatic first by following these [instructions](setup#demo-chromatic-unlinked).

If you use other services like Azure DevOps, AWS, etc, you won't be able to sign in via OAuth. But you can still use Chromatic as a CI-only job using the instructions [here](setup#demo-chromatic-unlinked).

### OAuth Scopes

Depending on your Git provider, Chromatic will request a set of OAuth scopes when you first login. Chromatic uses these permissions to enumerate your list of repos, set PR statuses and retrieve users for assignment to review. Chromatic will never read/write source code.

| Git provider                                                                                                                 | Scopes                                                   |
| ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [GitHub](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/#available-scopes)        | `['user:email', 'read:user', 'read:org', 'repo:status']` |
| [GitLab](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#limiting-scopes-of-a-personal-access-token)     | `['api']`                                                |
| [Bitbucket](https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html#OAuthonBitbucketCloud-Scopes) | `['account', 'repository', 'pullrequest', 'webhook']`    |

#### GitHub App permissions

Chromatic's GitHub App enables [UI Review](review) for pull requests. We need additional permissions to access pull request information and add PR checks.

- ✅ Read access to metadata
- ✅ Read and write access to checks and pull requests
- ✅ Read access to organization members (for collaborators)
- 🔒 We do not request access to your code

## Accounts

Chromatic mirrors access permissions at the "team" level to make permissions management quick and easy. Share access with your GitHub organization, Bitbucket group, or GitLab team by adding that account to Chromatic via the menu.

![Account menu](img/account-menu.png)

### Collaborator permissions

Permissions carry over at the repository level for collaborators. For example, if a person does not have access to repository in your Git provider they will also not have access to it in Chromatic.
To [verify UI tests](test#verify-ui-changes) and [review pull requests](review#review-changeset) collaborators must have `write` access to the repo.

| Permission level       | What collaborators can do                                           |
| ---------------------- | ------------------------------------------------------------------- |
| Organization: `member` | View / change account settings, view / add projects                 |
| Repo: `read`           | View project                                                        |
| Repo: `write`          | View and manage project, accept/deny UI tests, review pull requests |

<div class="aside">
If your project is hosted in Bitbucket, ensure that you and your team members have the <code>contributor</code> role.
</div>

## Projects

In Chromatic there two types of projects:

1. **Linked** projects, where access is linked to a project/repository on either GitHub, GitLab or Bitbucket (depending on which service you used to log in to Chromatic).
2. **Unlinked** projects, where access is controlled via an invite list

### Linked Projects

When you link a project to an online repository (on the "Manage" page, or when creating it), we synchronize access to the project with the permissions on the relevant service. There are two levels of access:

- Viewer: users can view snapshots and builds, but cannot review
- Reviewer: users can review snapshots and manage other aspects of the project.

Note that public repositories on GitHub/GitLab/Bitbucket give viewer access to all users. A user must be granted explicit contributor access by a maintainer to become a reviewer in Chromatic. For private repositories, anyone who has access to the repository in GitHub/GitLab/Bitbucket will have reviewer access in Chromatic.

### Unlinked Projects

To grant access to a unlinked project that you've created, either link it to a third-party repository, or use the invitation URL accessible on the "Manage" page.

Users that have used the invitation link will get reviewer access to the project.

<div class="aside">
 We're actively working in improving on how access control is implemented in Chromatic. Keep checking in for updates.
</div>

---

### Frequently asked questions

<details>
<summary>Why can't my teammates access a project?</summary>

Check that your teammates are listed as collaborators in that repository. If they aren't listed, please add them and try accessing the Chromatic project again (you may have to re-login). Chromatic syncs permissions at the account _and_ repo level.

</details>

<details>
<summary>How can I remove a collaborator from my project?</summary>

If the project is linked to a online repository, once you remove the collaborator from the repository, your collaborator's list will be automatically updated in Chromatic. 

For unlinked project, contact us via our in-app chat.

</details>
<details>
<summary>Why can't i update my email account in Chromatic?</summary>

Chromatic retrieves the email address associated to your account from your Git provider. Check your provider's account settings page on how to change your email.

</details>
