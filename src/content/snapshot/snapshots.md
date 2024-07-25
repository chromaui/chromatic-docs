---
layout: "../../layouts/Layout.astro"
title: Snapshots
description: What is a Snapshot in Chromatic
sidebar: { order: 1 }
---

# Snapshots

A snapshot is an image of a story plus some metadata captured by a standardized browser in Chromatic's Capture Cloud infrastructure. Snapshots power [UI Tests](/docs/test) and [UI Review](/docs/review).

<div class="aside">

Looking for information on snapshot billing? [Go to billing docs](/docs/billing)

</div>

## View snapshots for a story

The component screen allows you to select between 'Canvas' and 'Snapshot'. Under the Snapshot tab, you'll find the image captured by Chromatic's cloud browser -- this is exactly what the browser 'saw' at the time that it rendered the story. Swap between Snapshot and Canvas tabs to compare images to live implementation.

![Component screen with snapshot](../../images/component-snapshot.png)

<div class="aside">Tip: Click the expand icon in the top right to open the story in your published Storybook.</div>

## How are snapshots captured?

Chromatic captures snapshots by following these steps:

<details>
<summary>1. Load each story in the designated browser and viewport</summary>

Capture Cloud navigates to your published Storybook. It loads all stories in parallel at your desired [viewport](/docs/viewports) using our fleet of standardized [browsers](/docs/browsers).

</details>

<details>
<summary>2. Wait for the story to render</summary>

Capture Cloud uses underlying browser APIs combined with our own set of heuristics to determine when the component has "loaded". One of the primary heuristics Chromatic uses is network "quiesence" – a period of network inactivity which signals that all resources have loaded. Loading is the closest approximation for when component renders that's currently possible.

</details>

<details>
<summary>3. Take a screenshot and crop it to the dimensions of the UI</summary>

Chromatic crops the screenshot to the size of your component. It determines crop dimensions by measuring the bounding box of the child node of Storybook's `#storybook-root` element in version 7 or higher, or the `#root` element for previous versions. For atomic components, cropping eliminates negative spaces around snapshots reducing the visual information you must review. For pages, Chromatic captures the full width and height of the rendered UI.

</details>

<details>
<summary>4. Save snapshot and diff between previous baseline snapshots for a build or branch</summary>

Each snapshot is associated with a story and tagged with commit, branch, and other relevant metadata. Snapshots are stored in Chromatic's cloud. For UI Test and UI Review, snapshots are visually compared (diff) to identify changes. Our infrastructure is effectively capable of snapshotting every story in parallel, no matter how many stories you have.

</details>
