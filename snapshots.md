---
layout: default
title: Snapshots
description: What is a Snapshot in Chromatic
---

# Snapshots

A snapshot is an image of a story plus some metadata captured by a standardized browser in Chromatic's Capture Cloud infrastructure. Snapshots power [UI Test](test) and [UI Review](review).

- [How are snapshots captured?](#how-capture-works)
- [Improve snapshot consistency](#improve-snapshot-consistency)
- [View snapshots for a story](#view-snapshots-for-a-story)
- [Snapshot billing](billing)

## How are snapshots captured?

Here's how Chromatic snapshotting works:

<details>
<summary>

1. Load each story in the designated [browser](browsers) and [viewport](viewports)

</summary>

Capture Cloud navigates to your published Storybook. It loads all stories in parallel at your desired viewport using our fleet of standardized browsers.

</details>

<details>
<summary>

2. Wait for the story to render

</summary>

Capture Cloud uses underlying browser APIs combined with our own set of heuristics to determine when the component has "loaded". One of the primary heuristics Chromatic uses is network "quiesence" – a period of network inactivity which signals that all resources have loaded. Loading is the closest approximation for when component renders that's currently possible.

</details>

<details>
<summary>

3. Take a screenshot and crop it to the dimensions of the UI

</summary>

Chromatic crops the screenshot to the size of your component. It determines crop dimensions by measuring the bounding box of the child node of Storybook's `#root` element. For atomic components, cropping eliminates negative spaces around snapshots which makes increases the visual information you have to review. For pages, Chromatic captures the full width and height of the rendered UI.

</details>

<details>
<summary>

4. Save snapshot and diff between previous baseline snapshots for a build or branch

</summary>

Each snapshot is associated with a story and tagged with commit, branch, and other relevant metadata. Snapshots are stored in Chromatic's cloud. For UI Test and UI Review, snapshots are visually compared (diff) to identify changes. Our infrastructure is effectively capable of snapshotting every story in parallel, no matter how many stories you have.

</details>

## Improve snapshot consistency

It's essential that your components and stories render in a **consistent** fashion between tests to prevent false positives. Some reasons your stories might not render consistently and ways you can avoid this include:

- **Randomness in stories**: Components sometimes use random number generators to generate data for complex inputs. To avoid this, you can hard-code the input data, but often a more convenient solution is to use a tool like [seedrandom](https://github.com/davidbau/seedrandom) which you can use to make your "random" number generator consistent.

- **Use of the current date/time**: Dates and times are a testers bane! To get consistency in components or tests that use the current time, you can use a tool to also "seed" the time, like [timemachine](https://github.com/schickling/timemachine) for the `Date` object.

- **Animations**: Chromatic will attempt to pause all animations. However, you may need to [configure](animations) Chromatic's exact behavior.

- **Unpredictable resource hosts**: Resources that load from unpredictable or flaky sources may not load in time (15s) to capture. Workaround this by serving resources as [static files in Storybook](https://storybook.js.org/configurations/serving-static-files/) or using a [placeholder service](https://placeholder.com/). Learn more about how we [load resources](resource-loading).

- **Iframes rendering out of the viewport**: Some browsers only visually render iframes when they are inside of the viewport, despite the fact that they have loaded with all of their resources. For this reason, if you have an iframe that is placed below the viewport of a tall story, it will appear blank. You may want to [ignore that element](ignoring-elements) and also test it in isolation so that it fits inside of the viewport.

- **Skip stories**: Some stories may render unpredictably intentionally. If this is the case you may want to [ignore the story](ignoring-elements) from testing and move on.

- **Introduce a delay**: As a last resort, you can try adding a [delay](delay). This will delay Chromatic's snapshot for a specified amount of time. The trouble with this technique whilst it may make the problem less common, it may not eliminate the underlying issue in how the UI renders.

If you still need inconsistent elements for local development purposes inside Storybook, you can use `isChromatic()` exported from [our package](isChromatic) to apply the solutions above only when in the Chromatic environment.

## Browser differences between snapshots

Chromatic attempts to render as consistently as possible across our supported browsers. But browsers expose different capabilities which can affect your snapshots. It's normal to have slight differences in snapshots that

Chrome gives us full access to network APIs. That means we can confirm when resources load with greater accuracy. In a nutshell, your snapshots are more consistent. In Chrome, we render your story via a Storybook JS API, and then watch network activity, waiting for quiescence (a period of no network activity) before capturing a snapshot.

Firefox and Internet Explorer have built in APIs to tell when assets are loaded. In practice, these APIs are less nuanced than Chrome which may affect your snapshots. In Firefox and IE11, we browse to a Storybook URL that renders your story, then wait for the browser “load” event in addition to our own heuristics to determine when the story finishes rendering.

The above can behave differently if your page loads resources (such as JS files) via techniques that aren’t picked up by the load event (such as AJAX / background requests).

## View snapshots for a story

The component screen allows you to select between the 'Canvas', 'Snapshot', and 'Docs'. Under the Snapshot tab, you'll find the image captured by Chromatic's cloud browser -- this is exactly what the browser 'saw' at the time that it rendered the story. Swap between Snapshot and Canvas tabs to compare image to live implementation.

![Component screen](img/component.png)

<div class="aside">Tip: Click the expand icon in the top right to open the story in your published Storybook.</div>
