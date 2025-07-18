---
title: Slack
description: Connect Chromatic to Slack
sidebar: { order: 3 }
---

# Integrate with Chromatic

Integrate Chromatic into your existing tools and services with [webhooks](https://en.wikipedia.org/wiki/Webhook).

## Slack notifications

Post a message in a designated Slack channel when a build's [status changes](/docs/custom-webhooks#build-result-and-status-codes). Follow the instructions below to connect a Chromatic project to a Slack channel using a webhook. You can repeat this process to create webhook URLs for multiple channels.

1. Sign in to Slack
2. Create a [new app](https://api.slack.com/apps/new)
3. From the "Basic Information" settings section, set the "App name" to "Chromatic" and "App icon" to the custom Chromatic icon found below.
4. From the sidebar select "Incoming Webhooks" and toggle "Activate Incoming Webhooks" on.
5. Click "Add New Webhook to Workspace" to create a new incoming webhook
6. Choose the channel where you want Chromatic to post notifications and then click "Allow".
7. Copy the webhook URL. It's formatted like this `https://hooks.slack.com/services/...`
8. Go to your [Chromatic project](https://www.chromatic.com/start) and click the manage tab in the sidebar. Scroll down to "Integrations".
9. Click the "Add webhook" button in the Slack section then paste the webhook from step 7 into the input.
10. 🎉 You'll now receive notifications in your Slack channel.

> Please note that Slack notifications are not posted for passed builds.

The custom icon:
<img alt="Chromatic Slack icon" src="/docs/chromatic-slack-icon.png" style="max-width: 128px;" />
