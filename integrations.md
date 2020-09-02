---
layout: default
title: Integrations
description: Learn how connect chromatic to your system via webhooks
---

# Integrations

Learn how connect chromatic to your system via webhooks.

## Slack

You can connect slack to Chromatic and chromatic will push a message to a slack channel when a build is created, ready for review, passes or when is fails.

### Creating a slack webhook

1. From the [Incoming WebHooks](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks) page of the Slack App Directory, sign in and click Add to Slack.
2. Select the channel that should receive notifications and click Add Incoming WebHooks integration.
3. Copy the Webhook URL (has the format https://hooks.slack.com/services/...) for use in the next step.

*You can repeat this process to create webhook URLs for multiple channels.*

#### Adding the webhook to Chromatic

1. Navigate to your project's manage screen on [chromatic.com](https://www.chromatic.com/)
2. Under the "integrations" section paste the slack webhook you copied into the slack webhook field and save.

🎉 You should not receive notifications in your slack channel

## Custom webhooks

You can connect chromatic to any other system. Your webhook will be called whenever a build changes status.

For example a build can be created, awaiting approval, succeed, become approved, or fail.

We will call your webhook with the following data:

```json
{
  "event": "build-status-changed",
  "build": {
    "status": "BUILD_ACCEPTED",
    "webUrl": "https://www.chromatic.com/build?appId={appId}&number={buildNumber}",
    "committerName": "Jack",
    "number": 1,
    "branch": "tech/refactor",
    "storybookUrl": "https://{appId}-{hash}.chromatic.com/",
    "changeCount": 0,
    "componentCount": 42,
    "specCount": 100
  }
}
```
