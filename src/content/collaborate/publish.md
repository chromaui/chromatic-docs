---
title: Publish
description: Learn how Chromatic helps document components.
sidebar: { order: 6 }
---

# Publish your Storybook

The Chromatic CLI builds and publishes your Storybook to a secure online workspace, making all your stories accessible to your team at [chromatic.com](https://www.chromatic.com/start). Chromatic also indexes and versions your stories, creating a searchable library within the web app. This allows teams to discover, reuse, and reference existing components easily.

![Chromatic's publishing feature enables you to browse your component library and demo live components in the browser](../../images/workflow-document.png)

## Direct access to your Storybook

Every time you trigger a Chromatic build, your Storybook is published on our secure CDN. Published Storybooks are private by default with [access](/docs/access) restricted to logged in collaborators. [Visibility](/docs/collaborators#visibility) can be set to public if desired.

Chromatic generates a [permalink](/docs/permalinks) for the latest uploaded Storybook on a given branch. That makes it easy to share with your teammates or link to from docs. `https://<branch>--<appid>.chromatic.com`

![Direct Storybook](../../images/published-storybook.png)

## Link to specific branches

When you're linking to a library or component on Chromatic, it can be useful to link to the latest version on a `branch` rather than a specific build. To do so, add the `branch=foo` query parameter to the URL.

**Example**: `https://www.chromatic.com/library?appId=...&branch=main`.

## Embedding

If you're documenting components outside of Storybook, you may be able to [embed interactive stories](/docs/embed). This works on many platforms that support the oEmbed specification.

## Browse library

The library screen within the Chromatic web app visualizes the latest components on a branch-by-branch basis. Browse existing components to reuse or reference. Use the branch picker to find branch-specific components.

- Identify changes by comparing historical commits and branches
- Share the library with teammates
- Browse existing components for re-use

![Component library](../../images/library.png)

## Demo components

Components and their stories are securely indexed each commit and branch. Use the component screen to demo components without needing to switch branches, pull code, or Git. It's your window into the metadata and variations of the component. You can also share a link to this screen to get feedback.

- **Canvas**: Interact with the real component code to reproduce the behavior
- **Snapshot**: Verify the image [snapshots](/docs/snapshots) used for cross-browser [UI Tests](/docs#test-how-uis-look--function)

![Component screen](../../images/component.png)
