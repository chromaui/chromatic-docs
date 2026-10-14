---
title: Position sticky & fixed
description: Learn how to snapshot position sticky and fixed elements
sidebar: { order: 10 }
---

# Position sticky & fixed

Chromatic captures `position:sticky` and `position:fixed` elements in their initial positions once per snapshot.

We do this because sticky and fixed elements can persist in the viewport even when content extends beyond it. Since these elements can change with scroll, we use the element's initial position when the browser loads to anchor it where it appears in your snapshot.

For example, if your UI has a bottom positioned element the sticky element will appear in the bottom position when the browser loads, the remaining content will flow under it.

```css
position: sticky;
bottom: 0;
```

![Position sticky snapshots](../../images/position-sticky-fixed.jpg)

---

## Troubleshooting

### Capture content scrolled inside an element

To capture content scrolled inside an element, give that element a fixed height and `overflow: auto`, then scroll it in your story's `play` function. Chromatic waits for the play function to finish, but resets the page's scroll position before capture.

This example wraps the story in a scrollable decorator:

```jsx title="Scrolled.stories.jsx"
import React from 'react';
import { within } from 'storybook/test';

export default { title: 'Scrolled content' };

export const Scrolled = {
  decorators: [
    (Story) => (
      <div style={{ height: '568px', overflow: 'auto' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div style={{ height: '1200px', paddingTop: '800px', boxSizing: 'border-box' }}>
      <p>Somewhere, USA</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const target = within(canvasElement).getByText('Somewhere, USA');
    target.scrollIntoView({ behavior: 'instant', block: 'center' });
  },
};
```

Use your component in place of the example content. With Storybook 8, import `within` from `@storybook/test` instead.

<details>

<summary>I set an element to use sticky positioning, but it's not working. What could be the issue?</summary>

If the parent of your sticky element uses `display: grid;`, `display: flex;`, or similar styles, the layout might behave differently when rendering a story by itself. In such cases, we recommend wrapping the story with a [decorator](https://storybook.js.org/docs/writing-stories/decorators#wrap-stories-with-extra-markup) `div` and setting `display: initial;` to it.

</details>
