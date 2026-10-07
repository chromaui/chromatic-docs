---
name: connect-project
description: Finds this repository's Chromatic project id, by looking it up from the git remote or asking the user, and records it in chromatic.config.json, so every Chromatic tool knows which project to ask about. Use when a Chromatic tool needs a projectId, when chromatic.config.json is missing or has no projectId, or when the user shares a link to their Chromatic project.
---

# Connect a Chromatic project

Every Chromatic tool takes a `projectId`, and the place it lives is
`chromatic.config.json` at the repository root. This skill reads the id from
that file, looks it up from the repository, or asks the user once, then writes
the file so nobody is asked again.

## Steps

1. Look for `chromatic.config.json`, starting at the repository root. In a
   monorepo with several, list them and ask which project the user means.
2. If the file exists and has a `projectId`, report it and stop. The value may
   carry a `Project:` prefix (`"Project:5d67dc0374b2e300209c41e7"`); the tools
   accept it either way.
3. If the file is missing, or has no `projectId`, look the project up from
   the repository:
   - Read the remote with `git remote get-url origin`. The last two path
     segments are the owner and the repository name, without `.git`:
     `git@github.com:acme/web.git` and `https://github.com/acme/web` both give
     `acme` and `web`.
   - Run this with `chromatic_query`, passing `owner` and `name`:

     ```graphql
     query ProjectsForRepository($owner: String!, $name: String!) {
       viewer {
         accounts {
           name
           projects(filter: { repositoryOwner: $owner, repositoryName: $name }, limit: 10) {
             id
             name
             webUrl
           }
         }
       }
     }
     ```

   - One project matches: use its `id`, name the project to the user so they
     can correct it, and go to step 5.
   - Several match: list them by account and project name, and ask which one.
   - None match, there is no remote, or the query is refused (a login from
     before account access was added, or no Chromatic MCP): go to step 4.
4. Ask the user for one of:
   - a link to the project in the Chromatic web app. Every project URL carries
     the id as `appId`, for example
     `https://www.chromatic.com/builds?appId=5d67dc0374b2e300209c41e7`;
   - the id itself, from the project's Manage page.

   The id is 24 hex characters. Do not guess it, and do not accept a project
   token in its place: the token is what the CLI and CI authenticate with, and
   the tools refuse it.
5. Write the id to `chromatic.config.json` at the repository root, keeping any
   other settings the file already has:

   ```json
   {
     "projectId": "Project:5d67dc0374b2e300209c41e7"
   }
   ```

   Chromatic's own setup writes this same file and the CLI reads it, so this
   is the committed form the repository is expected to carry.
6. Tell the user the file is ready to commit, and report the id so the tool
   call that needed it can go ahead.

This connects the project to the Chromatic MCP, the server that answers for
builds and accessibility results. The published Storybook's own docs server is
a different server; the README says how to add it by hand.
