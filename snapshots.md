---
layout: default
title: Snapshots
description: What is a Snapshot in Chromatic
---

# Snapshots

Snapshots represent a rendering of a story and power Chromatic's [test](test) and [review](review) features.

## What are snapshots?

A snapshot is an image of a story plus some metadata captured by a browser within Chromatic's cloud infrastructure.

For every story in your Storybook: Chromatic will load the story, wait for it to render, take a screenshot and crop it to the correct bounding region. Snapshots are stored in the cloud and used to determine UI changes between builds or branches.

#### Snapshots for multiple viewports and browsers

Chromatic takes a separate snapshot for every combination of viewport and browser that you've configured. Responsive UI can render differently across viewports and browsers.

## Snapshot vs. Canvas vs. Docs

The component screen allows you to select between the 'Canvas', 'Snapshot', and 'Docs'. Under the Snapshot tab, you'll find the image captured by Chromatic's cloud browser -- this is exactly what the browser 'saw' at the time that it rendered the story.

The Canvas and Docs tabs represent the actual rendered story plus its documentation, exactly as you'd see it within Storybook. It's a convenient place to check the interactive behavior and use browser devtools to inspect styling.

![Component screen](img/component.png)

<div class="aside">Tip: Click the expand icon in the top right to open the story in your published Storybook.</div>

## Focus and hover states

Chromatic renders your story in the state that Storybook renders it in. This means if you focus or hover an element as part of the rendering of the story, the element will be in a focused state. Learn how to [capture these states with Chromatic](hoverfocus).

#### Cursors for inputs and textareas

Chromatic hides the caret, a flashing cursor, to prevent intermittent changes to your stories that require verification (false negatives).

---

### Frequently asked questions

<details>
<summary>How does Chromatic account for snapshots?</summary>

Snapshot usage is controlled at an account level. If you have multiple projects, we'll sum the number of snapshots used in each project to get the total value. Read our [documentation](billing) to learn more.

</details>
