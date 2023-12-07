---
layout: "../../layouts/Layout.astro"
title: Quickstart for reviewers
description: How to use Chromatic for designers and product managers
sidebar: { order: 6 }
---

# Quickstart for reviewers

Chromatic automates UI development so you can build more features, faster, and with less manual work. Here’s the recommended workflow that takes full advantage of everything we have to offer.

![Chromatic workflow](../../images/chromatic-workflow.png)

### 6. Publish and share your Storybook

During the build process, Chromatic builds and publishes your Storybook to its secure workspace (CDN) accessible to your entire team. That keeps everyone in sync with the latest UI implementation. No fussing with dependencies, git, or local dev environments.

- [Share permalinks with collaborators](/docs/permalinks#share-permalinks-with-collaborators)
- [Custom domain for your Storybook](/docs/permalinks#custom-domain-for-your-storybook)

The published Storybook is a shared reference point for your entire team, making cross-discipline collaboration easier.

#### Document your components

Storybook can automatically [generate UI documentation](https://storybook.js.org/docs/react/writing-docs/introduction) for components. These pages will contain stories rendered as live examples, as well as an interactive "args" table that showcases the component API. Customize the generated docs with additional prose. With Chromatic, you'll get shareable docs URL for your team to reference.

#### Connect Storybook and Figma

[Storybook Connect](/docs/figma-plugin) is a Figma plugin that allows you to link stories to Figma components. Once linked, you can view your live stories in the design workspace without leaving Figma.

<video autoPlay muted playsInline loop width="560px" class="center" style="pointer-events: none;" title="Embedded story and design side-by-side">
  <source src="/docs/assets/figma-plugin-open-story.mp4" type="video/mp4" />
</video>

#### Embed stories to showcase your work

[Embed](/docs/embed#embed-stories) stories in Medium articles, Notion pages, and countless other platforms that support oEmbed. You get to interact with live rendered components instead of static images.

---
