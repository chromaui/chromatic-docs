---
layout: default
title: Access control
description: Learn how to control who has access to your Chromatic project
---

# Access control for projects and accounts

Learn how to manage access to your Chromatic account and projects.

---

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

## Accounts

Chromatic mirrors access permissions at the "team" level to make permissions management quick and easy. Share access with your GitHub organization, Bitbucket group, or GitLab team by adding that account to Chromatic via the menu.

Permissions also carry over at the repository level. For example, if a person does not have access to repository in your code host they will also not have access to it in Chromatic.

![Account menu](img/account-menu.png){: .center }

---

### Troubleshooting

#### Your teammates can't access a project

Check that your teammates are listed as collaborators in that repository. If they aren't listed, please add them and try accessing the Chromatic project again (you may have to re-login). Chromatic syncs permissions at the account _and_ repo level.
