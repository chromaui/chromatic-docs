---
layout: "../../layouts/Layout.astro"
title: Embed stories
description: Embed your Storybook on Medium, Notion, and other platforms
---

# Embed stories

Embed stories published to Chromatic in Medium articles, Notion pages, and countless other platforms.

Before we begin, you'll need to figure out which embed format your platform supports: oEmbed or standard `<iframe>`s. From there, paste the URL of a published story in the given format.

## Embed a story with the toolbar

Embed a story with the toolbar by replacing the `<appid>`, `<uploadhash>`, and `<path-to-story>` with the details for your story. You can retrieve this URL by opening your Storybook from a Build or Library screen. Embedding Storybooks by their branch name or commit hash is not supported yet.

```shell
// oEmbed
https://<appid>-<uploadhash>.chromatic.com/?path=<path-to-story>

// iframe embed
<iframe src="https://<appid>-<uploadhash>.chromatic.com/?path=<path-to-story>&full=1&shortcuts=false&singleStory=true" width="800" height="400"></iframe>
```

![Full Storybook embed on Medium](../../images/embed-story-toolbar.png)

## Embed a plain story

Embed a plain story without the toolbar by replacing the `<appid>`, `<uploadhash>`, and `<path-to-story>` with the details for your story.

```shell
// oEmbed
https://<appid>-<uploadhash>.chromatic.com/iframe.html?<path-to-story>&viewMode=story

// iframe embed
<iframe src="<appid>-<uploadhash>.chromatic.com/?path=<path-to-story>&viewMode=story&shortcuts=false&singleStory=true" width="800" height="400"></iframe>
```

![Plain canvas embed on Medium](../../images/embed-story.png)

## Embed a docs page

You can also embed a docs page by replacing the `<appid>`, `<uploadhash>`, and `<path-to-story>` with the details for your story.

```shell
// oEmbed
https://<appid>-<uploadhash>.chromatic.com/iframe.html?<path-to-story>&viewMode=docs

// iframe embed
<iframe src="https://<appid>-<uploadhash>.chromatic.com/?path=<path-to-story>&viewMode=docs&shortcuts=false&singleStory=true" width="800" height="400"></iframe>
```

![Docs page embed on Medium](../../images/embed-docs.png)

---

### How to embed stories on popular platforms

<details>

<summary>How to embed stories in Medium</summary>

Paste the Storybook URL into your Medium article, then press Enter. The embed will automatically resize to fit the height of your story.

While editing an article, Medium renders all embeds non-interactive. Once you publish, the embed will be interactive. [View live demo on Medium »](https://medium.com/@ghengeveld/embedding-storybook-on-medium-ce8a280c03ad)

</details>

<details>

<summary>How to embed stories in Notion</summary>

In your Notion doc type `/embed`, press Enter, then paste the Storybook URL as the embed link. You can manually resize the embed as needed.

![Notion embed command](../../images/embed-notion.png)

</details>

<details>

<summary>How to embed stories in Ghost</summary>

In your Ghost post type `/html`, press Enter, then paste the `<iframe>` URL. You can manually resize the embed via the height and width properties as needed.

![Notion embed command](../../images/embed-ghost.png)

</details>
