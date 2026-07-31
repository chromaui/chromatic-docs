---
sidebar: { hide: true }
title: Why doesn't font or text alignment match my dev environment?
section: 'uiTestsAndReview'
---

# Why doesn't font or text alignment match my dev environment?

Text can appear slightly misaligned in your published Storybook (and in the visual snapshots Chromatic captures from it) compared to what you see locally. This is most noticeable in components that mix icons and text, such as a button with a label between two icons. There are two common causes.

## Check that fonts load consistently

Browsers can render HTML before custom fonts finish loading, and font rendering varies between browsers, versions, and operating systems. If the published Storybook falls back to a different font than your dev environment, text metrics (and therefore alignment) will shift. See [font loading](/docs/font-loading) for techniques to preload fonts and ensure they render consistently.

## Unwrapped text in a flex layout can't be individually adjusted

Consider a button that lays out an icon, a text label, and a chevron with flexbox:

```html
<button>
  <svg><!-- icon --></svg>
  Small
  <svg><!-- chevron --></svg>
</button>
```

When you apply `display: flex` to a parent container (the `<button>` in this case), only its direct children become flex items. The two `<svg>` tags are element nodes, so they automatically become flex items that obey flex properties.

Because the text "Small" is an anonymous text node, the browser wraps it in an anonymous flex item.

While the parent's `align-items` and `justify-content` will align this anonymous text alongside the icons, you cannot override or fine-tune its layout _individually_. Because there is no element wrapper around the word "Small", **you cannot write a CSS selector to target it**. This means you cannot apply specific fixes to it, such as:

- `align-self: center` (or `flex-end`) to override the parent's alignment for just that text.
- `margin-inline` or `padding` to add breathing room between the text and the icons without affecting them.
- `flex-grow` or `flex-shrink` to control how it behaves when space is tight, independently of the icons.
- `order` to change its position in the layout.

The anonymous flex item's size and baseline come entirely from font metrics, so any small difference in how the font renders between your machine and the browser rendering your published Storybook shows up as an alignment shift you cannot correct with a targeted CSS rule.

### Solution: Wrap the text in an element

Give the text its own element so it becomes a regular flex item:

```html
<button>
  <svg><!-- icon --></svg>
  <span>Small</span>
  <svg><!-- chevron --></svg>
</button>
```

Now the label can be targeted with a CSS selector, so you can apply `align-self`, margins, or any of the properties above to make its alignment consistent across environments.
