---
title: 'Create an M2M OAuth client (Private Beta)'
description: 'How to create a machine-to-machine OAuth client for the Chromatic API — prerequisites, the createOAuthClient mutation, available scopes, and storing credentials.'
sidebar:
  hide: true
isHidden: true
---

# Create an M2M OAuth client (Private Beta)

A machine-to-machine (M2M) OAuth client lets headless automation (CI pipelines, bots, and services) authenticate with the [Chromatic API](/docs/api) using a client ID and client secret. There's no browser redirect and no user approval step.

M2M clients are attached to an account rather than a user. Create one by running the `createOAuthClient` mutation in the GraphQL explorer.

## Prerequisites

- You are an **admin** of the account you're creating the client for.
- The account is enrolled in the private beta. If it isn't, [contact support](mailto:support@chromatic.com?Subject=M2M%20OAuth%20client%20access) to request access.

## Find your account ID

Sign in to Chromatic and go to [https://www.chromatic.com/apps](https://www.chromatic.com/apps). Select the account you want from the account picker, then read the `accountId` query parameter out of the URL:

```bash
https://www.chromatic.com/apps?accountId=689126b1bf7b127209b4c5b1
```

Here the account ID is `689126b1bf7b127209b4c5b1`.

## Open the GraphQL explorer

While signed in, go to [https://www.chromatic.com/api](https://www.chromatic.com/api). This is an Apollo Studio explorer where you can browse the schema and run queries and mutations as yourself.

## Run the createOAuthClient mutation

Paste this mutation into the explorer:

```graphql
mutation CreateOAuthClient($input: CreateOAuthClientInput!) {
  createOAuthClient(input: $input) {
    clientId
    clientSecret
    name
    scopes
  }
}
```

And these variables, replacing `<account_id>` with the ID you found above:

```json
{
  "input": {
    "accountServiceClient": {
      "accountId": "<account_id>",
      "name": "CI Automation",
      "scopes": [
        "account:read",
        "account:write",
        "build:read",
        "build:write",
        "project:read",
        "project:write",
        "storybook:read"
      ]
    }
  }
}
```

The `scopes` list above requests everything an M2M client can do. Remove the scopes your automation doesn't need. A client can only ever request the scopes it was created with, so granting the minimum keeps the credentials less valuable if they leak.

### Scopes

| Scope            | What it unlocks                                                       |
| ---------------- | --------------------------------------------------------------------- |
| `account:read`   | `account` query — account name, avatar, projects list                 |
| `account:write`  | `account.subscription` field — billing and plan details               |
| `project:read`   | `project` query — project metadata, branch names, last build          |
| `project:write`  | Create, update, and remove projects; manage collaborators and invites |
| `build:read`     | `build` query — build status, result, commit, test counts             |
| `build:write`    | `reviewTest` mutation — accept or deny test snapshots                 |
| `storybook:read` | `storybook` query — published Storybook URL and build link            |

M2M clients act on behalf of an account, not a user, so the `user:read` scope isn't available to them and the `viewer` query can't be used. Use the [`account`](/docs/api#account) query as your entry point instead.

### Client name

`name` is optional. It's the display name for the client and the machine user backing it, and it defaults to your account name followed by "Service Client". Names may only contain letters, numbers, spaces, periods, dashes, and underscores.

## Save your credentials

A successful response looks like this:

```json
{
  "data": {
    "createOAuthClient": {
      "clientId": "4f3c9a1e7b2d48f0a6c5e9d3b7182a4c",
      "clientSecret": "9f8e7d6c5b4a392817065f4e3d2c1b0a8f7e6d5c4b3a29180716f5e4d3c2b1a0",
      "name": "CI Automation",
      "scopes": ["account:read", "build:read", "project:read"]
    }
  }
}
```

<div class="aside">

🚨&nbsp;&nbsp;The `clientSecret` is returned **only once**, in this response. Chromatic stores it hashed and can't show it to you again. Copy it now into your CI provider's secret manager or another secure store. If you lose it, create a new client.

</div>

## Next steps

Exchange your client ID and client secret for an access token using the [client credentials flow](/docs/api#client-credentials-m2m), then start [making requests](/docs/api#making-requests).
