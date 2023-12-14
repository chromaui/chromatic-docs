---
layout: "../../layouts/Layout.astro"
title: Quickstart for reviewers
description: How to use Chromatic for designers and product managers
sidebar: { order: 6 }
---

# Quickstart for reviewers

Chromatic is made for designers, product managers, and other stakeholders to collaborate with developers.

## Before pull request

Chromatic serves as a library that maps every part of your UI. Use it as a shared reference point to ensure that everyone is referencing the latest UI as they design and spec products.

#### Keep everyone in sync with what's in production

During the design and product process, you often need to reference what's in production. But it's time consuming to navigate to the right page in the right state. Chromatic builds and publishes your Storybook online whenever you push code. This keeps everyone in sync with the latest UI implementation. No fussing with dependencies, git, or local dev environments.

- [Share permalinks with collaborators](/docs/permalinks#share-permalinks-with-collaborators)
- [Custom domain for your Storybook](/docs/permalinks#custom-domain-for-your-storybook)

#### Integrate with Figma to reference the real UI as you design

Design and development naturally diverge. During the design process, you need to double-check what's in production to ensure designs are accurate. Chromatic's [Storybook Connect](/docs/figma-plugin) plugin allows you to link stories to Figma components. Once linked, you can view your live stories in the design workspace without ever leaving Figma.

<video autoPlay muted playsInline loop width="560px" class="center" style="pointer-events: none;" title="Embedded story and design side-by-side">
  <source src="/docs/assets/figma-plugin-open-story.mp4" type="video/mp4" />
</video>

#### Documentation that's always up to date

Documentatation goes out of date quickly. Storybook and Chromatic work together to automatically [generate UI documentation](https://storybook.js.org/docs/writing-docs/introduction) and publish it to a shareable URL. This documentation contains stories rendered as live examples, as well as an interactive component API explorer. Customize the generated docs with additional prose.

#### Embed stories in Notion and other oEmbed services

During the specification process, you often need to describe complex UI behaviors that words can't do justice. [Embed](/docs/embed#embed-stories) UI from Storybook directly into Notion, Medium, and countless other platforms that support oEmbed. This way your readers can interact with live, rendered components that easily show behavior.

---

## During pull request

During the pull request, stakeholders go to Chromatic at different points to verify test failures and discuss implementation details.

### UI Tests are made for other frontend developers

[UI Tests](/docs/test) check for bugs in appearance and functionality. These serve a similar purpose as unit tests, but for UI. The difference with Chromatic is that the bug finding and fixing process is collaborative. The key features for reviewers are:

- Share links to failed tests
- Create discussions and mention stakeholders
- Pin comments beside affected areas
- Pull request checks
- Slack and email notifications
- Customizable webhooks for workflow automation

<video autoPlay muted playsInline loop width="560px" class="center" style="pointer-events: none;">
  <source src="/docs/assets/testscreen-comment-pinned-optimized.mp4" type="video/mp4" />
</video>

### UI Review is made for designers and product managers

[UI Review](/docs/review) is where you discuss implementation details with teammates and get their explicit sign off. Chromatic works behind the scenes to make the review process easy by organizing change requests, notifying reviewers, and syncing with your Git provider. The key features for reviewers are:

- Generate changesets to focus reviewer attention on only what changed
- Assign reviewers manually or automatically
- Specify fine-grained roles for each stakeholder
- Create discussions and mention stakeholders
- Resolve discussions to show that feedback was addressed

![UI Checklist](../../images/prscreen-ui-checklist.png)
