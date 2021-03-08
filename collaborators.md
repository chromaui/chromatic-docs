---
layout: default
title: Collaborators
description: Learn how to add and manage collaborators
---

# Collaborators

Chromatic keeps track of UI feedback and tests in one place so that collaborators stays aligned without you having to do extra work.

## Organization collaborators

Chromatic mirrors access permissions with your GitHub Organization, Bitbucket Group, or GitLab Team. Users who have access to your organization will also have access to your Chromatic organization.

| Permission level       | What collaborators can do                           |
| ---------------------- | --------------------------------------------------- |
| Organization: `member` | View / change account settings, view / add projects |

Organization collaborators can manage billing and account status but may not have access to projects. You need to be a [project collaborator](#project-collaborators) to view and manage projects.

Go to your organization's Settings page to view collaborators.

![Settings page collaborators](img/collaborators-organization.png)

<div class="aside">
Email and password accounts don't have the concept of organization-level collaborators. 
</div>

## Project collaborators

Chromatic syncs access permissions with your GitHub, Bitbucket, or GitLab repository. Users who have access to your code will also have access to your project.

| Permission level | What collaborators can do                                             |
| ---------------- | --------------------------------------------------------------------- |
| Repo: `read`     | View project, auto-assigned the [Viewer](#roles) role                 |
| Repo: `write`    | Review and manage project, auto-assigned the [Developer](#roles) role |

<div class="aside">
If your project is hosted in Bitbucket, ensure that you and your team members have the <code>contributor</code> role.
</div>

Project collaborators can view and manage the project based on their [role](#roles). Go to your project's Manage page to view collaborators and assign roles.

![Project collaborators](img/collaborators-project.png)

You can add or remove a collaborator by adjusting their access in your Git repository. The permission changes in your upstream repository are mirrored downstream in Chromatic.

Manually override the mirrored permissions by adjusting collaborator [roles](#roles) or [inviting external collaborators](#external-collaborators) on an ad hoc basis.

![Project manage page collaborators](img/collaborators-project-git.png)

If you signed up via email and password, Chromatic won't have a Git repo to sync with. You'll need to manage project collaborators manually via external collaborators below.

### External collaborators

Projects can also have external collaborators. These are stakeholders like PMs, designers, and consultants who don't commit code but contribute to the sign off process. They can also be fellow developers who don't have repo access or use a different Git provider.

External collaborators are added and removed manually. Invite them via a link or email. Once they create an account they'll get access to your project.

![Project manage page external collaborators](img/collaborators-project-external.png)

### Roles

Roles give you fine-grained control over who can do what. There are four roles that can be assigned to any collaborator.

Each project has a unique set of roles that are managed by the project owner. For example, you can be an "developer" in one project and a "viewer" in another.

| Role                | What you can do                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| Owner               | Can manage, delete the project, and manage/assign roles to collaborators.                                      |
| Developer (default) | Can manage the project, review tests, approve PRs, and assign reviewers. Cannot assign roles to collaborators. |
| Reviewer            | Can leave comments, review tests, and approve PRs they're assigned to. Cannot assign others or self-approve.   |
| Viewer              | Read-only access to the project.                                                                               |

#### Project ownership

Projects must have at least one owner. The `owner` role is automatically assigned to the first user in a Chromatic project.

Transfer ownership by assigning another collaborator as an owner and then reassigning yourself another role.

#### View your role

Go to your project's Manage page to view your role and it's capabilities.

![Project manage page your role](img/collaborators-role.png)

#### Roles for open source projects

Open source projects are viewable to all users even if they're not listed as a collaborator or have a Chromatic account. But in order to manage or review the open source project, collaborators must have explicit access and the corresponding role.

---

### Troubleshooting

<details>
<summary>Why can't my teammates access a project?</summary>

Chromatic syncs permissions at the account _and_ repo level. Check that your teammates are listed as collaborators in your GitHub, GitLab, or Bitbucket repository.

If they aren't listed, please add them and try accessing the Chromatic project again (you may have to sign in again). Learn more about [access control](access).

</details>