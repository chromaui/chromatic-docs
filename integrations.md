---
layout: default
title: Integrations
description: Connect Chromatic to other services with webhooks
---

# Integrate with Chromatic

Integrate Chromatic into your existing tools and services with [webhooks](https://en.wikipedia.org/wiki/Webhook).

## Slack notifications

Post a message in a designated Slack channel when a build's [status changes](#status-notifications). Follow the instructions below to connect a Chromatic project to a Slack channel using a webhook. You can repeat this process to create webhook URLs for multiple channels.

1. Sign in to Slack and add the [Incoming WebHooks](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks) app to your workspace.
2. Choose the channel where you want Chromatic to post notifications then click “Add Incoming WebHooks integration”.
3. Set the icon to the custom icon below.
4. Copy the webhook URL. It's formatted like this `https://hooks.slack.com/services/...`
5. Go to your [Chromatic project](https://www.chromatic.com/start) and click the manage tab in the sidebar. Scroll down to "Integrations".
6. Click the "Add webhook" button in the Slack section then paste the webhook from step 3 into the input.
7. 🎉 You'll now receive notifications in your Slack channel.

The custom icon:
![Chromatic Slack icon](img/chromatic-slack-icon.png)

## Custom webhooks

Connect Chromatic to other services that support webhooks to script custom behavior and automate advanced workflows.

1. Go to your [Chromatic project](https://www.chromatic.com/start) and click the manage tab in the sidebar. Scroll down to "Integrations".
2. Click the "Add webhook" button in the custom webhook section then paste your webhook into the input.

When a build's [status changes](#status-notifications) we'll call your webhook with this data:

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

## Status notifications

Chromatic reports these statuses for each build.

| Build               | Status             |
| ------------------- | ------------------ |
| 🌕 Ready for review | `BUILD_PENDING`    |
| ✅ Accepted         | `BUILD_ACCEPTED`   |
| ✅ Passed           | `BUILD_PASSED`     |
| 🔴 Denied           | `BUILD_DENIED`     |
| 🔴 Failed           | `BUILD_FAILED`     |
| ⚫️ Error           | `BUILD_ERROR`      |
| ⚫️ Timed out       | `BUILD_TIMED_OUT`  |
| ⚫️ Not captured    | `BUILD_NO_CAPTURE` |
