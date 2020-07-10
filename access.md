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

If you use other services like Azure DevOps, AWS, etc, you won't be able to sign in via OAuth. But you can still use Chromatic as a CI-only job using the intructions [here](setup#demo-chromatic-unlinked).

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
- 🔒 We do not request access to your code.

## Accounts

Chromatic mirrors access permissions at the "team" level to make permissions management quick and easy. Share access with your GitHub organization, Bitbucket group, or GitLab team by adding that account to Chromatic via the menu.

Permissions also carry over at the repository level. For example, if a person does not have access to repository in your code host they will also not have access to it in Chromatic.

![Account menu](img/account-menu.png)

## Projects

In Chromatic there two types of projects:

1. **Linked** projects, where access is linked to a project/repository on either GitHub, GitLab or Bitbucket (depending on which service you used to log in to Chromatic).
2. **Unlinked** projects, where access is controlled via an invite list

### Linked Projects

When you link a project to an online repository (on the "Manage" page, or when creating it), we synchronize access to the project with the permissions on the relevant service. There are two levels of access:

- Read access: users can view snapshots and builds, but cannot review
- Write access: users can review snapshots and manage other aspects of the project.

Note that public repositories on GitHub/GitLab/Bitbucket give read access to all users, but a user must be granted write access by a maintainer. Private access maintain read/write access according to the service's permission rules.

### Unlinked Projects

To grant access to a unlinked project that you've created, either link it to a third-party repository, or use the invitation URL accessible on the "Manage" page.

Users that have used the invitation link will get full write access to the project.

---

### Frequently asked questions

<details>
<summary>Why can't my teammates access a project?</summary>

Check that your teammates are listed as collaborators in that repository. If they aren't listed, please add them and try accessing the Chromatic project again (you may have to re-login). Chromatic syncs permissions at the account _and_ repo level.

</details>
