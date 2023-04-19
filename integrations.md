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

1. Go to [Chromatic](https://www.chromatic.com/start), select your project and click the Manage tab in the sidebar.
2. Scroll down to "Integrations", click the "Add webhook" button in the custom webhook section and set your webhook URL.

We'll send a `POST` request to your webhook to notify about the following events:

| `event`           | Sent when                                            |
| ----------------- | ---------------------------------------------------- |
| `build`           | A build was created or its status has changed        |
| `review`          | A review was created or its status has changed       |
| `review-decision` | A reviewer was assigned or they approved the changes |

See [Custom webhooks](custom-webhooks) for details about the webhook payloads.
