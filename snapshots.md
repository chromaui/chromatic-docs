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

Chromatic takes a separate snapshot for every combination of viewport and browser that you've configured.Responsive UI can render differently across viewports and browsers.

## Snapshot vs Canvas vs Docs

The component screen allows you to select between the 'Canvas', 'Snapshot' and 'Docs'. Under the Snapshot tab you'll find the image captured by Chromatic's cloud browser -- this is exactly what the browser 'saw' at the time that it rendered the story.

The Canvas and Docs tabs represent the actual rendered story plus it's documentation, exactly as you'd see it within Storybook. It's a convenient place to check the interactive behavior and use browser devtools to inspect styling.

![Component screen](img/component.png)

<div class="aside">Tip: Click the expand icon in the top right to open the story in your published Storybook.</div>

## Focus and hover states

Chromatic renders your story in the state that Storybook renders it in. This means if you focus or hover an element as part of the rendering of the story, the element will be in a focused state. Learn about how to [capture these states with Chromatic](hoverfocus).

#### Cursors for inputs and textareas

Chromatic hides the caret, a flashing cursor, to prevent intermittent changes to your stories that require verification (false negatives).

---

### Frequently asked questions

<details>
<summary>What happens when I run out of snapshots on the free plan?</summary>
Free plans come with 5000 snapshots per month. Once free snapshots are exhausted, testing & review will become paused until the next month at which time Chromatic will again begin taking snapshots and functionality will automatically resume. Upgrading to a paid plan will immediately unpause testing & review.

Chromatic will compare snapshots to the last build with snapshots, so if snapshots were paused you may be surprised to find new comparisons made against baselines which appear out of date.

</details>

<details>
<summary>What happens if I disable UI Tests and/or UI Review?</summary>

As long as either the testing or review features are enabled, Chromatic will continue taking snapshots. With both disabled, Chromatic will stop taking snapshots and all other features of the platform (such as publishing) will continue without limits.

</details>

<details>
<summary>Do I use more snapshots when both UI Tests and UI Review are enabled?</summary>

No. Snapshots taken for one workflow are reused for the other. You don't get charged twice.

</details>

### Troubleshooting

<details>
<summary>Where are my images and fonts?</summary>

Make sure your resource hosts are reliably fast. When possible serve resources staticly via Storybook or use a dedicated service. Learn more about [resource loading in Chromatic](resource-loading).

If your resources are behind a firewall, whitelist our domain so we can load your resources.

</details>

<details>
<summary>Why isn’t my modal or dialog captured? </summary>

If you use an “animateIn” effect set [delay](delay) to ensure we snapshot when the animation completes.

If your component infers its dimensions from the layout of the surrounding DOM elements (e.g., it's a modal that uses `position:fixed`), you'll need to set the height of that component's stories using a decorator.

```js
import MyComponent from './MyComponent'

export default {
  component: MyComponent,
  decorators: [
    storyFn => (
      {% raw %}<div style={{ width: '1200px', height: '800px' }}>{% endraw %}
        This is a decorator for modals and such {storyFn()}
      </div>
    ),
  ],
}

export const StoryWithDimensions = () => <MyComponent/>
```

</details>

<details>
<summary>Where's my "position: fixed" component?</summary>

Fixed position elements may depend on viewport size but not have dimensions themselves. Wrap your component in an element whose height and width are defined.

</details>

<details>
<summary>My stories won't load due to cross-origin request errors</summary>

Most likely you are calling into `window.parent` somewhere in your code. As we serve your Storybook preview iframe inside our www.chromatic.com domain this leads to a x-origin error as your code doesn't have access to our frame (with good reason!). Generally speaking it is a good idea to wrap calls like that in a `try { } catch` in case the code is running in a context where that's not possible (e.g Chromatic).

</details>
