---
layout: default
title: Integrations
description: Connect Chromatic to other services with webhooks
---

# Integrate with Chromatic

Integrate Chromatic into your existing tools and services with [webhooks](https://en.wikipedia.org/wiki/Webhook).

## Slack notifications

Post a message in a designated Slack channel when a build's [status changes](#result-and-status-codes). Follow the instructions below to connect a Chromatic project to a Slack channel using a webhook. You can repeat this process to create webhook URLs for multiple channels.

1. Sign in to Slack and add the [Incoming WebHooks](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks) app to your workspace.
2. Choose the channel where you want Chromatic to post notifications then click “Add Incoming WebHooks integration”.
3. Set the icon to the custom Chromatic icon found below.
4. Set the "Customize name" to "Chromatic".
5. Copy the webhook URL. It's formatted like this `https://hooks.slack.com/services/...`
6. Go to your [Chromatic project](https://www.chromatic.com/start) and click the manage tab in the sidebar. Scroll down to "Integrations".
7. Click the "Add webhook" button in the Slack section then paste the webhook from step 4 into the input.
8. 🎉 You'll now receive notifications in your Slack channel.

> Please note that Slack notifications are not posted for passed builds.

The custom icon:
![Chromatic Slack icon](img/chromatic-slack-icon.png)

## Custom webhooks

Connect Chromatic to other services that support webhooks to script custom behavior and automate advanced workflows.

1. Go to your [Chromatic project](https://www.chromatic.com/start) and click the manage tab in the sidebar. Scroll down to "Integrations".
2. Click the "Add webhook" button in the custom webhook section, then paste your webhook into the input.

When a build's [status changes](#result-and-status-codes), we'll send a `POST` request to your webhook with a body that looks like this:

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
    "projectName": "my-repo"
  }
}
```

The `event` name is constant, but the `build` data will vary.

#### How to integrate custom webhooks

Chromatic will make a post request with the above body to the designated webhook URL. That gives you flexibility to catch the webhook response and customize it to fit the service you're integrating with.

Most customers set up a simple proxy app to customize the webhook message. Below are some starter projects for known Git providers that use Express as a proxy to help you integrate with Chromatic.

| Git provider | Repository                                                 |
| ------------ | ---------------------------------------------------------- |
| GitHub       | [Source](https://github.com/chromaui/github-webhook-proxy) |
| GitLab       | [Source](https://github.com/chromaui/gitlab-webhook-proxy) |

### Signed Webhooks

Chromatic supports signed webhooks. Here is an example code of handling them: [signed-webhook-examples](https://github.com/chromaui/signed-webhook-examples). Please contact us via in-app chat or <a href="mailto:support@chromatic.com?Subject=Signed%20webhooks">email</a> to enable signed webhooks on your account.

### Result and status codes

| Update                            | `result`        | `status`    | Legacy `status`  |
| --------------------------------- | --------------- | ----------- | ---------------- |
| 🌕 Ready for review (has changes) | `SUCCESS`       | `PENDING`   | `BUILD_PENDING`  |
| 🟢 Passed (no changes)            | `SUCCESS`       | `PASSED`    | `BUILD_PASSED`   |
| 🟢 Accepted                       | `SUCCESS`       | `ACCEPTED`  | `BUILD_ACCEPTED` |
| 🔴 Denied                         | `SUCCESS`       | `DENIED`    | `BUILD_DENIED`   |
| 🔴 Broken                         | `CAPTURE_ERROR` | `BROKEN`    | `BUILD_FAILED`   |
| ⚫️ Canceled                      | `SYSTEM_ERROR`  | `CANCELLED` | `BUILD_ERROR`    |
| ⚫️ Error                         | `SYSTEM_ERROR`  | `FAILED`    | `BUILD_ERROR`    |
| ⚫️ Timed out                     | `TIMEOUT`       | `FAILED`    | `BUILD_ERROR`    |

<div class="aside">

If you've been using a custom webhook for a long time, or used to have one in the past, your project might still be configured to receive the legacy `status` values.
You can either continue to use the old values, or contact us so we can switch your project over to the new values. Removing and recreating your webhook will not automatically update you to the new format.

</div>
