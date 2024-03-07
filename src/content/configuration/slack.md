---
layout: "../../layouts/Layout.astro"
title: Slack
description: Connect Chromatic to Slack
sidebar: { order: 3 }
---

# Integrate with Chromatic

Integrate Chromatic into your existing tools and services with [webhooks](https://en.wikipedia.org/wiki/Webhook).

## Slack notifications

Post a message in a designated Slack channel when a build's [status changes](/docs/custom-webhooks/#build-result-and-status-codes). Follow the instructions below to connect a Chromatic project to a Slack channel using a webhook. You can repeat this process to create webhook URLs for multiple channels.

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
![Chromatic Slack icon](../../images/chromatic-slack-icon.png)
