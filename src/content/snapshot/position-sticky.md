---
layout: "../../layouts/Layout.astro"
title: Position sticky & fixed
description: Learn how to snapshot position sticky and fixed elements
sidebar: { order: 3 }
---

# Position sticky & fixed

Chromatic captures `position:sticky` and `position:fixed` elements in their initial positions once per snapshot.

We do this because sticky and fixed elements can persist in the viewport even when content extends beyond the viewport. Since these elements can change with scroll, we use the initial position of the element when the browser loads to anchor where it appears in your snapshot.

For example, if your UI has a bottom positioned element the sticky element will appear in the bottom position when the browser loads, the remaining content will flow under it.

```css
position: sticky;
bottom: 0;
```

![Position sticky snapshots](../../images/position-sticky-fixed.jpg)
