---
title: Upgrading webhooks to the latest version
description: How to upgrade from an older custom webhooks integration
---

# Upgrading webhooks

If you currently have a v1 custom webhooks integration, you'll be receiving `POST` request payloads like this:

```json
{
  "event": "build-status-changed",
  "build": {
    "number": 123,
    "result": "SUCCESS",
    "status": "BUILD_ACCEPTED",
    "webUrl": "https://www.chromatic.com/build?appId=5dca7f6a6ce19b00201febb7&number=123",
    "branch": "main",
    "commit": "f6f223efb3b99b83ac3b0b6ece9f9620619933c1",
    "committerName": "John Doe",
    "storybookUrl": "https://5dca7f6a6ce19b00201febb7-yubzntxvow.chromatic.com/",
    "changeCount": 12,
    "componentCount": 42,
    "specCount": 100,
    "projectName": "my-project"
  }
}
```

Newer webhooks follow this format instead:

```json
{
  "version": 2,
  "event": "build",
  "build": {
    "number": 123,
    "branch": "main",
    "commit": "f6f223efb3b99b83ac3b0b6ece9f9620619933c1",
    "committerName": "John Doe",
    "status": "ACCEPTED",
    "result": "SUCCESS",
    "storybookUrl": "https://5dca7f6a6ce19b00201febb7-yubzntxvow.chromatic.com/",
    "webUrl": "https://www.chromatic.com/build?appId=5dca7f6a6ce19b00201febb7&number=123",
    "changeCount": 12,
    "componentCount": 42,
    "specCount": 100,
    "project": {
      "name": "my-project",
      "accountName": "my-org",
      "accountAvatarUrl": "https://avatars.githubusercontent.com/u/24584319?s=200",
      "webUrl": "https://www.chromatic.com/builds?appId=5dca7f6a6ce19b00201febb7"
    }
  }
}
```

Notable changes:

- `version` was added, currently always having value `2`
- `event` was renamed from `build-status-changed` to just `build`
- `event` can be `build`, `review` or `review-decision`
- `build.status` values no longer have the `BUILD_` prefix and has a few new [options](/docs/custom-webhooks#build-result-and-status-codes)
- `build.project` was added to contain more project information
- `build.projectName` was superseded by `build.project.name`

Also note that the `build` field will not be present for [review updates](/docs/custom-webhooks#review-decisions) and [review decisions](/docs/custom-webhooks#review-updates).

## Upgrade path

To upgrade your webhook to the new format, we recommend the following process:

1. Update your webhooks handler to support the new format alongside the old format. Use the `version` field to disambiguate. Note that this field didn't exist prior to version 2.
2. Upgrade your webhook integration to v2 through the Manage screen of your project.
3. Update your webhooks handler to drop support for the old format.
