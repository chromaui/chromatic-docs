---
title: Infrastructure release notes
description: Chromatic's browser infrastructure release notes
---

# Chromatic Capture Cloud release notes

## Version 8

Welcome to `Chromatic Capture Cloud version 8` released October 2025.

**Status**: General Availability

Key highlights on this release:

- **Shadow DOM Support:** Previously, Chromatic did not capture Shadow DOM elements without additional Storybook configuration. With Capture 8, open-root Shadow DOM is supported without additonal changes.
- **Elements Outside Root:** Capture 8 improves support for capturing elements like sticky footers which are positioned outside the Storybook root.
- **Infinite Animation Pausing:** Support has been added for automatically pausing infinite CSS animations in a consistent way.
- **`.isChromatic`:** Capture now adds the class `isChromatic` to the `body` element during capture. This allows you to target the Chromatic capture environment specifically in your CSS if needed.
- The browser updates might lead to a few changes in how your story renders:
  - Starting in Chrome 135, **`<b>` tags are now styled as “bolder”** (used to be “bold” previously)
  - **Color shift in Safari:** Certain combinations of colors, layered images, and CSS filters can cause a color shift in Safari due to WebKit's image rendering. This is a rare issue and should not affect most users.
  - The **formatting of unordered lists with surrounding text has changed** consistently across all browsers. Previously, surrounding text was aligned with the bullets; it is now aligned with the list item text.

### Supported browsers versions

| Browser | Version |
| ------- | ------- |
| Chrome  | 140     |
| Firefox | 141.0   |
| Safari  | 26.0    |
| Edge    | 140     |

---

## Version 7

Welcome to `Chromatic Capture Cloud version 7` released February 2025.

**Status**: Outdated ([opt in for upgrade](/docs/infrastructure-upgrades#opt-in-to-upgrade))

Key highlights on this release:

- **Handle clipped elements:** Previously Chromatic calculated the snapshot size without accounting for `overflow: clipped` elements, those are now clipped.
- `Intl.ListFormat` now works in Safari thanks to the version upgrade.
- **Improved video support:** Some video services, like BrightCove and Wistia, use ephemeral source URLs that cause encoding errors in snapshots when `autoplay` is enabled. Chromatic now handles these cases correctly by displaying a poster or a blank video if no poster exists.
- **Better Redirect Detection:** Chromatic now alerts you when a story reloads the page, causing a snapshot error. Previously, these stories would throw an error without providing enough context to understand the cause. Now, you'll know what caused the error so you can fix the story.
- **New capture region:** Previously, Chromatic based the story size on the `#storybook-root` element. Now, it will base it on the `<body>` element. This means modals, dialogs, and other portal-based elements will be captured without needing to wrap stories in a fixed-height decorator.
- [**New options for Modes:**](/docs/modes/browser-options) You can now configure each mode's color scheme, touch events, and locale.

### Supported browsers versions

| Browser | Version |
| ------- | ------- |
| Chrome  | 132     |
| Firefox | 134.0   |
| Safari  | 18.2    |
| Edge    | 132     |

---

## Version 6

Welcome to `Chromatic Capture Cloud version 6` released February 2024.

**Status**: Outdated ([opt in for upgrade](/docs/infrastructure-upgrades#opt-in-to-upgrade))

Key highlights on this release:

- Chrome version updated to version 121
- Firefox version updated to version 121
- Safari version updated to version 17.4
- Edge version updated to version 121
- Automatically pause videos and animated GIFs at their first frame
- [`pauseAnimationAtEnd`](/docs/animations#css-animations) is now enabled by default
- Adds support for [`parameters.viewport.defaultViewport`](/docs/modes/viewports#using-defaultviewport)

### Supported browsers versions

| Browser | Version |
| ------- | ------- |
| Chrome  | 121     |
| Firefox | 121     |
| Safari  | 17.4    |
| Edge    | 121     |

---

## Version 5

Welcome to `Chromatic Capture Cloud version 5` released February 2023.

**Status**: Outdated ([opt in for upgrade](/docs/infrastructure-upgrades#opt-in-to-upgrade))

Key highlights on this release:

- Chrome version updated to version 105
- Firefox version updated to version 103
- Safari version 16 added
- Edge version 105 added

### Supported browsers versions

| Browser | Version |
| ------- | ------- |
| Chrome  | 105     |
| Firefox | 103     |
| Safari  | 16      |
| Edge    | 105     |

---

## Version 4

Welcome to `Chromatic Capture Cloud version 4` released January 2022.

**Status**: Outdated ([opt in for upgrade](/docs/infrastructure-upgrades#opt-in-to-upgrade))

Key highlights on this release:

- Firefox version updated to version 92

### Supported browsers versions

| Browser           | Version |
| ----------------- | ------- |
| Chrome            | 89      |
| Firefox           | 92      |
| Internet Explorer | 11      |

---

## Version 3

Welcome to `Chromatic Capture Cloud version 3` released July 2021.

**Status**: No longer available

Key highlights on this release:

- Chrome version updated to version 89

### Supported browsers versions

| Browser           | Version |
| ----------------- | ------- |
| Chrome            | 89      |
| Firefox           | 65      |
| Internet Explorer | 11      |

---

## Version 2

Welcome to `Chromatic Capture Cloud version 2` released December 2020.

**Status**: No longer available

Key highlights on this release:

- Chrome version updated to version 84

### Supported browsers versions

| Browser           | Version |
| ----------------- | ------- |
| Chrome            | 84      |
| Firefox           | 65      |
| Internet Explorer | 11      |

---

## Version 1

Welcome to `Chromatic Capture Cloud version 1` released January 2020.

**Status**: No longer available

Key highlights of this release:

- Migration from outdated infrastructure

### Supported browsers versions

| Browser           | Version |
| ----------------- | ------- |
| Chrome            | 73      |
| Firefox           | 65      |
| Internet Explorer | 11      |

---
