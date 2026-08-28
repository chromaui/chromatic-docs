---
title: 'Chromatic API (Private Beta)'
description: "Getting started with Chromatic's GraphQL API for agents (private beta) — endpoint, OAuth 2.0 authentication for user-facing and machine-to-machine clients, queries, mutations, and scopes."
sidebar:
  hide: true
isHidden: true
---

# Chromatic API (Private Beta)

Chromatic's public API is built using GraphQL. If you are new to GraphQL, Apollo has [resources for beginners](https://blog.apollographql.com/the-basics-of-graphql-in-5-links-9e1dc4cac055). The official [GraphQL documentation](https://graphql.org/) is another good starting point.

<details>
  <summary>Prompt for AI-assisted set up</summary>

Follow this doc to authenticate with OAuth 2.0 in order to access the Chromatic API: https://www.chromatic.com/docs/llms/api.txt

If you have a client secret, authenticate with the client credentials grant. Otherwise, use the authorization code flow with PKCE.

The client id is: <REPLACE_WITH_CLIENT_ID_PROVIDED_BY_CHROMATIC>
The client secret is: <REPLACE_WITH_CLIENT_SECRET_OR_DELETE_THIS_LINE>
The account id is: <REPLACE_WITH_ACCOUNT_ID_OR_DELETE_THIS_LINE>

If you authenticated without a client secret, use the `viewer` query via `accounts { projects }`. If you have a client secret, use the `account` query with the account id above

</details>

## Endpoint

Chromatic's GraphQL endpoint is:

```bash
https://www.chromatic.com/api
```

It supports introspection so you can query the whole schema.

Note this is an early access feature so there are some endpoints that you can see but aren't scoped to access.

## Getting started

With the client ID you received, go through the authorization flow (outlined below) to receive an `access_token`.

Once you have it, our GraphQL API is explorable and queryable via [Apollo Studio](https://www.chromatic.com/api): a GraphQL client where you can browse the schema and run queries.

Add the `Authorization` header with the value `Bearer <access_token>` to authenticate your requests.

### Authentication

Chromatic supports two OAuth 2.0 flows to issue access tokens. All API requests must include a valid access token in the `Authorization` header.

| Flow                                                          | Use when                                                                                       | Credentials                 |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------- |
| [Authorization code with PKCE](#authorization-code-with-pkce) | An agent or tool acts on behalf of a signed-in user, such as local development or an IDE agent | Client ID                   |
| [Client credentials (M2M)](#client-credentials-m2m)           | Headless automation runs with no user present, such as a CI pipeline, bot, or service          | Client ID and client secret |

#### Authorization code with PKCE

<div class="aside">

If you are in the private beta, reach out directly to your dedicated Chromatic point of contact to obtain a client ID.

</div>

Use your client ID with the Chromatic OAuth client to run the authorization code flow. This opens a browser window for you to approve access, then exchanges the resulting code for a token pair.

**Authorization endpoint** — `https://www.chromatic.com/authorize`

| Parameter               | Value                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `response_type`         | `code`                                                                                                  |
| `client_id`             | `<your_client_id>`                                                                                      |
| `redirect_uri`          | Your local callback (e.g. `http://localhost:8080/callback`)                                             |
| `scope`                 | `user:read account:read account:write project:read project:write build:read build:write storybook:read` |
| `resource`              | `https://www.chromatic.com/api` (required)                                                              |
| `code_challenge_method` | `S256`                                                                                                  |

Chromatic will redirect to your `redirect_uri` with `?code=<AUTH_CODE>&state=<STATE>`.

**Token endpoint** — `https://www.chromatic.com/token`

| Parameter       | Value                                        |
| --------------- | -------------------------------------------- |
| `grant_type`    | `authorization_code`                         |
| `client_id`     | `<your_client_id>`                           |
| `code`          | The authorization code from the redirect     |
| `redirect_uri`  | Same value used in the authorization request |
| `code_verifier` | Your PKCE verifier                           |
| `resource`      | `https://www.chromatic.com/api` (required)   |

Include the access token in the `Authorization` header of every API request:

```javascript
Authorization: Bearer <your_access_token>
```

<div class="aside">

💡 Access tokens expire after **60 minutes**. Use the `refresh_token` grant to get a new one without re-authorizing.

</div>

---

#### Refreshing your token

This applies to the authorization code flow only, the client credentials grant doesn't issue refresh tokens. Access tokens are short-lived. Use your `refresh_token` to obtain a new token pair without re-authorizing. Refresh tokens **rotate on every use**. Always save the new `refresh_token` from the response.

```bash
curl -s -X POST https://www.chromatic.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=refresh_token" \
  --data-urlencode "client_id=<your_client_id>" \
  --data-urlencode "refresh_token=<your_refresh_token>" \
  --data-urlencode "resource=https://www.chromatic.com/api"
```

---

#### Client credentials (M2M)

Machine-to-machine (M2M) clients authenticate directly with a client ID and client secret. There's no browser redirect and no user approval step, which makes this the right flow for CI pipelines, bots, and other headless automation. To create one, follow [Create an M2M OAuth client](/docs/m2m-oauth-client).

**Token endpoint** — `https://www.chromatic.com/token`

| Parameter       | Value                                      |
| --------------- | ------------------------------------------ |
| `grant_type`    | `client_credentials` (required)            |
| `client_id`     | `<your_client_id>` (required)              |
| `client_secret` | `<your_client_secret>` (required)          |
| `resource`      | `https://www.chromatic.com/api` (required) |

```bash
curl -s -X POST https://www.chromatic.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=client_credentials" \
  --data-urlencode "client_id=<your_client_id>" \
  --data-urlencode "client_secret=<your_client_secret>" \
  --data-urlencode "resource=https://www.chromatic.com/api"
```

The response contains an `access_token` that you pass in the `Authorization` header, exactly as with the PKCE flow.

<div class="aside">

💡 Access tokens expire after **60 minutes**. M2M clients don't receive a refresh token, request a new access token with the same grant when the current one expires.

</div>

Treat the client secret like a password. Store it in your CI provider's secret manager and never commit it. Chromatic shows it once, when you create the client, and can't retrieve it afterwards.

M2M tokens act on behalf of an account, not a user, so the `viewer` query and the `user:read` scope aren't available. Use the [`account`](#account) query as your entry point instead.

---

### Making requests

All requests are `POST` to `https://www.chromatic.com/api` with a JSON body containing your `query` and optionally `variables`.

This example queries `viewer`, which requires the `user:read` scope and is available via the [authorization code with PKCE](#authorization-code-with-pkce) flow only. With an M2M token, query [`account`](#account) instead.

```bash
curl -s -X POST https://www.chromatic.com/api \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "query": "{ viewer { id name username } }"
  }'
```

A successful response looks like this:

```json
{
  "data": {
    "viewer": {
      "id": "User:5f3e7b2a1c9d4e0001a2b3c4",
      "name": "Jane Smith",
      "username": "janesmith"
    }
  }
}
```

#### Errors

The GraphQL API always returns HTTP `200`, even when something goes wrong. Check for an `errors` array in the response body:

```json
{
  "errors": [
    {
      "message": "Not authorized",
      "locations": [{ "line": 1, "column": 3 }],
      "path": ["viewer"]
    }
  ],
  "data": null
}
```

Common error causes:

- **Expired token:** access tokens last 60 minutes; refresh and retry
- **Insufficient scope:** the token doesn't include the scope required for that field
- **Not found:** the requested ID doesn't exist or isn't accessible to the authenticated user

---

### Queries

#### viewer

Returns the authenticated user's profile. Requires the `user:read` scope, which is available via the [authorization code with PKCE](#authorization-code-with-pkce) flow only.

```bash
curl -s -X POST https://www.chromatic.com/api \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "query": "{ viewer { id name projectCount accounts { id name } } }"
  }'
```

```json
{
  "data": {
    "viewer": {
      "id": "User:5f3e7b2a1c9d4e0001a2b3c4",
      "name": "Jane Smith",
      "projectCount": 8,
      "accounts": [
        {
          "id": "Account:689126b1bf7b127209b4c5b1",
          "name": "Acme Org"
        }
      ]
    }
  }
}
```

---

#### account

Returns an account by ID — either a personal account or an organization. Requires the `account:read` scope.

**Arguments:**

| Argument | Type | Description        |
| -------- | ---- | ------------------ |
| `id`     | ID!  | Account identifier |

Both the bare ID (as found in the `chromatic.com/apps` URL) and the prefixed `Account:` form (as returned in API responses) are accepted.

```bash
curl -s -X POST https://www.chromatic.com/api \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "query": "query($id: ID!) { account(id: $id) { id name webUrl projects { id }} }",
    "variables": { "id": "<account_id>" }
  }'
```

```json
{
  "data": {
    "account": {
      "id": "689126b1bf7b127209b4c5b1",
      "name": "Acme Org",
      "webUrl": "https://www.chromatic.com/apps?accountId=689126b1bf7b127209b4c5b1",
      "projects": [
        {
          "id": "Project:689126d2bf7b127209b4c5b2"
        }
      ]
    }
  }
}
```

---

#### project

Returns a project by ID. Requires the `project:read` scope.

**Arguments:**

| Argument | Type | Description        |
| -------- | ---- | ------------------ |
| `id`     | ID!  | Project identifier |

```bash
curl -s -X POST https://www.chromatic.com/api \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "query": "query($id: ID!) { project(id: $id) { id name webUrl branchNames lastBuild { id number status branch } } }",
    "variables": { "id": "<project_id>" }
  }'
```

```json
{
  "data": {
    "project": {
      "id": "Project:689126d2bf7b127209b4c5b2",
      "name": "Marketing Site",
      "webUrl": "https://www.chromatic.com/builds?appId=689126d2bf7b127209b4c5b2",
      "branchNames": ["main", "feat/new-button"],
      "lastBuild": {
        "id": "Build:6891293bbf7b127209b4c6e8",
        "number": 42,
        "status": "COMPLETED",
        "branch": "main"
      }
    }
  }
}
```

---

#### build

Returns a build by ID. Requires the `build:read` scope.

**Arguments:**

| Argument | Type | Description      |
| -------- | ---- | ---------------- |
| `id`     | ID!  | Build identifier |

Builds progress through several stages — `AnnouncedBuild`, `PublishedBuild`, `PreparedBuild`, `StartedBuild`, and `CompletedBuild` — and expose different fields at each stage. Use inline fragments to handle this:

```bash
curl -s -X POST https://www.chromatic.com/api \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "query": "query($id: ID!) { build(id: $id) { id number status branch commit ... on CompletedBuild { result testCount componentCount storybookUrl tests { nodes { id } } } } }",
    "variables": { "id": "<build_id>" }
  }'
```

```json
{
  "data": {
    "build": {
      "id": "Build:6891293bbf7b127209b4c6e8",
      "number": 42,
      "status": "COMPLETED",
      "branch": "main",
      "commit": "a1b2c3d4e5f6",
      "result": "SUCCESS",
      "testCount": 128,
      "componentCount": 24,
      "storybookUrl": "https://689126d2bf7b127209b4c5b2-afxirxnxyz.chromatic.com/",
      "tests": {
        "nodes": [
          {
            "id": "Test:6891294cbf7b127209b4c6f6"
          },
          {
            "id": "Test:6891294cbf7b127209b4c6fe"
          }
        ]
      }
    }
  }
}
```

---

#### storybook

Returns a published Storybook by URL. Supports Chromatic-hosted URLs and custom domains. Requires the `storybook:read` scope.

**Arguments:**

| Argument | Type | Description                    |
| -------- | ---- | ------------------------------ |
| `url`    | URL! | URL of the published Storybook |

```bash
curl -s -X POST https://www.chromatic.com/api \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "query": "query($url: URL!) { storybook(url: $url) { buildUrl storybookUrl } }",
    "variables": { "url": "<storybook_url>" }
  }'
```

```json
{
  "data": {
    "storybook": {
      "buildUrl": "https://www.chromatic.com/builds?appId=689126d2bf7b127209b4c5b2&number=42",
      "storybookUrl": "https://689126d2bf7b127209b4c5b2-afxirxnxyz.chromatic.com/"
    }
  }
}
```

---

### Mutations

#### reviewTest

Accepts or denies a test snapshot, optionally applying the decision to all tests in the same story, component, or build. Requires the `build:write` scope.

**Input fields:**

| Field    | Type                   | Description                                                 |
| -------- | ---------------------- | ----------------------------------------------------------- |
| `testId` | ID!                    | The test to review                                          |
| `status` | ReviewTestInputStatus! | `ACCEPTED`, `DENIED`, or `PENDING` (resets to unreviewed)   |
| `batch`  | ReviewTestBatch        | Optionally apply to `SPEC` (story), `COMPONENT`, or `BUILD` |

```bash
curl -s -X POST https://www.chromatic.com/api \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "query": "mutation($input: ReviewTestInput!) { reviewTest(input: $input) { updatedTests { id status result } userErrors { ... on BuildSupersededError { message } ... on TestNotFoundError { message } ... on TestUnreviewableError { message } } } }",
    "variables": {
      "input": {
        "testId": "<test_id>",
        "status": "ACCEPTED"
      }
    }
  }'
```

```json
{
  "data": {
    "reviewTest": {
      "updatedTests": [
        {
          "id": "Test:6891294cbf7b127209b4c6fe",
          "status": "ACCEPTED",
          "result": "ADDED"
        }
      ],
      "userErrors": []
    }
  }
}
```

If the review fails, errors come back in `userErrors` rather than the top-level `errors` array. Always check this field:

```json
{
  "data": {
    "reviewTest": {
      "updatedTests": null,
      "userErrors": [{ "message": "Build is superseded by a newer build on this branch" }]
    }
  }
}
```

---

### Scopes reference

Scopes follow a `subject:action` pattern. Requesting a scope grants access to the endpoints listed below — nothing more.

| Scope            | What it unlocks                                                       |
| ---------------- | --------------------------------------------------------------------- |
| `user:read`      | `viewer` query — name, username, avatar, project count                |
| `account:read`   | `account` query — account name, avatar, projects list                 |
| `account:write`  | `account.subscription` field — billing and plan details               |
| `project:read`   | `project` query — project metadata, branch names, last build          |
| `project:write`  | Create, update, and remove projects; manage collaborators and invites |
| `build:read`     | `build` query — build status, result, commit, test counts             |
| `build:write`    | `reviewTest` mutation — accept or deny test snapshots                 |
| `storybook:read` | `storybook` query — published Storybook URL and build link            |

---

## Deprecation & Breaking Changes Policy

We'll announce upcoming breaking changes at least 3 months in advance of any changes to the GraphQL schema, to give integrators time to make the necessary adjustments. Changes take effect on the first day of each quarter (January 1st, April 1st, July 1st, or October 1st). For example, if we announce a change on January 15th, it will be made on July 1st.

### Changes for January 1, 2027

- `Test.comparisons` will be removed. Please use `Test.visualComparisons` and `Test.accessibilityComparisons` instead.
