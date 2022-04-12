---
layout: default
title: Access control
description: Learn how to control who has access to your Chromatic project
---

# Access control

Learn how to manage access to your Chromatic account and projects.

## Authentication

Sign up via OAuth or email. Chromatic supports the cloud versions of GitHub, GitLab, or Bitbucket on our [self-serve plans](https://www.chromatic.com/pricing).

If you use the on-premise or enterprise versions of GitHub, GitLab, or Bitbucket, we can support you via our [enterprise plan](https://www.chromatic.com/pricing). The enterprise plan also offers single sign-on (SSO) and service-level agreements (SLA). We recommend trialing Chromatic first by following these [instructions](setup#demo-chromatic-unlinked).

If you use other services like Azure DevOps, AWS, etc, we recommend signing up via email. You can still use Chromatic as a CI-only job using the instructions [here](setup#demo-chromatic-unlinked).

### OAuth Scopes

Depending on your Git provider, Chromatic will request a set of OAuth scopes when you first sign in. Chromatic uses these permissions to enumerate your list of repos, set PR statuses, and retrieve users for assignment to review. Chromatic will never read/write source code.

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

## Organizations

A Chromatic organization mirrors its counterpart GitHub Organization, Bitbucket Group, or GitLab Team. Open the account menu to swap between organizations or add a new organization.

![Account menu](img/account-menu.png)

## Projects

There two types of Chromatic projects: linked and unlinked.

#### Linked projects

Linked projects are associated with a repository on GitHub, Bitbucket, or GitLab. That allows Chromatic to [sync collaborators](collaborators#project-collaborators), badge pull requests, get pull request metadata for [UI Review](review), and keep track of [UI Test](test) baselines.

You can link a project during the project creation process or afterward on the project's Manage page within the Collaborators tab.

#### Unlinked projects

Unlinked projects are not linked to a repository on GitHub, Bitbucket, or GitLab. They do not automatically [sync collaborators](collaborators#project-collaborators) or badge pull requests. An unlinked project is perfect for teams that self-host Git or have enterprise Git providers (that aren't on Chromatic's enterprise plan).

The characteristics of an unlinked project include:

- Chromatic runs as a [CI-only](ci) job.
- Collaborators are [manually managed](collaborators#external-collaborators) via an invite list.
- PR badging is manually configured in your CI provider.
- Notifications are manually setup via Chromatic's [custom webhooks](integrations#custom-webhooks).

Learn how to create an unlinked project [here](setup#demo-chromatic-unlinked).

<div class="aside">

When can I create an unlinked project? You can only create unlinked projects on email/password accounts. If your account currently syncs permissions with GitHub, Bitbucket, or GitLab, you'll need to create a new email/password account to set up an unlinked project. Message us via in-app chat to share billing between accounts.

</div>
