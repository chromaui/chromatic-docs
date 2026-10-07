---
title: Unstable tests debugging
description: Learn why tests become unstable, improve test stability, and troubleshoot snapshot rendering issues.
sidebar: { order: 11, label: 'Unstable tests' }
slug: 'unstable-tests'
---

# Unstable tests debugging

Use this guide when a test is unstable or when a snapshot is consistently wrong, incomplete, or otherwise unexpected. These are different problems, but they often share causes such as animations, resources that load late, dynamic data, or layout behavior.

## What is an unstable test?

An unstable test renders differently across repeated runs even when your code hasn't changed. For example, an animation might be caught mid-frame, a font might load late, dynamic data might change, or a network request might not finish in time.

<div class="aside">

Chromatic automatically detects and ignores unstable tests with [Flake filter](/docs/flake-filter) so they don't block your build. If you're not ready to fix an unstable test, [quarantine it](/docs/quarantine-tests) to ignore its diffs on every build and track it until you are.

</div>

## Improve test stability

Your components and stories must render stably to prevent false positives. The following practices can improve test stability:

- **Randomness in tests**: Components sometimes use random number generators to create data for complex inputs. You can hard-code the input data or use a tool such as [seedrandom](https://github.com/davidbau/seedrandom) to generate stable values.

- **Animations**: Chromatic attempts to pause all animations. However, you may need to [configure animation behavior](/docs/animations).

- **Unpredictable resource hosts**: Resources that load from unpredictable or unreliable sources may not load within the 15-second capture window. Serve resources as static files, use a [placeholder service](https://placehold.co/), and learn how to make [resource loading](/docs/resource-loading) more reliable.

- **Image CDNs and compression algorithms**: Image CDNs optimize image weight and size, which can affect how images render. Since this happens upstream of Chromatic, changes to those images are detected as visual changes. Ensure the served images are identical every time and use stable compression settings. Also consider serving images as static files or using a [placeholder service](https://placehold.co/).

- **Web font loading**: Web fonts can load at different times and make tests unstable, especially when combined with [interactions](/docs/interactions). Serve web fonts as static files and [preload](/docs/font-loading) them.

- **Iframes rendering out of the viewport**: Some browsers only visually render iframes when they are inside the viewport, even when they have loaded all their resources. If an iframe is below the viewport of a tall story, it will appear blank. You may want to [ignore the element](/docs/ignoring-elements) and test it in isolation so it fits inside the viewport.

- **Use of the current date and time**: To keep tests that use the current time stable, use a tool such as [mockdate](https://www.npmjs.com/package/mockdate) to set the `Date` object to a fixed value.

- **UI takes time to render**: UI can take extra time to settle into its final state. Add a [delay](/docs/delay) before taking a snapshot. This can make instability less obvious in snapshots, but it won't eliminate the underlying rendering issue.

- **Intentional randomness**: Some stories are intentionally dynamic. You may want to [exclude the story from UI Tests](/docs/disable-snapshots#with-storybook). If those dynamic elements are still useful during local development, use [`isChromatic()`](/docs/ischromatic) to apply these stability techniques only in Chromatic.

## Start with the trace

Each unstable test includes a [trace](/docs/trace-viewer) with network requests, console logs, DOM snapshots, and snapshot metadata. Start there to identify what changed during capture, then use the rendering issues below to find a likely cause and fix.

## Common snapshot rendering issues

### Missing or incorrect content

<details>
<summary>Why do I see "Can't access cssRules, likely due to CORS restrictions"?</summary>

If you see this error while loading Google Fonts, check the stylesheet link in `.storybook/preview-head.html`.

Add `crossorigin="anonymous"` to the stylesheet link so the browser requests it with CORS:

```html title=".storybook/preview-head.html"
<link href="<your font URL>" rel="stylesheet" crossorigin="anonymous" />
```

The stylesheet host must also allow the request with an `Access-Control-Allow-Origin` response header. If it doesn't, serve the stylesheet from the same origin as your Storybook.

</details>

<details>
<summary>Why are my styles missing or applied in the wrong order?</summary>

**If you use Vite with CSS modules**, check the filenames. Vite treats `utils.module.scss` as a CSS module, but `utils.scss` as a regular stylesheet.

**If you load global stylesheets outside your component tree**, reference them from `.storybook/preview-head.html`:

```html title=".storybook/preview-head.html"
<link href="/css/layout.css" rel="stylesheet" />

<link href="/css/overrides.css" rel="stylesheet" />
```

Check the order of the links and any conflicting rules in DevTools. The stylesheets cascade in the order listed.

</details>

<details>
<summary>Why does a browser permission read as "denied" in Chromatic but not locally?</summary>

If a browser permission returns `denied` in Chromatic's capture iframe, the snapshot will show that state. An interaction cannot grant a permission blocked by the iframe's policy.

To test the granted state, mock the permission result in your story. You can also use [`isChromatic()`](/docs/ischromatic) or an environment variable to render a specific state.

</details>

<details>
<summary>Why can't Chromatic find a file that exists locally?</summary>

A filename may have different casing from its import path or asset URL. This can work on a case-insensitive filesystem but fail in Chromatic's Linux capture environment.

Check that every import path and asset URL matches the actual filename exactly, including case.

</details>

<details>
<summary>Where are my images and fonts?</summary>

Image and font rendering can be tricky. Resources that load from unpredictable or flaky sources may not load within the 15-second capture window. Work around this by:

- Ensure that [fonts load in Chromatic](/docs/font-loading).
- Ensure that [resources load in Chromatic](/docs/resource-loading).
- Serve resources as [static files](/docs/resource-loading) to improve test speed.
- Use a [placeholder service](https://placehold.co/).

If your resources are behind a firewall, whitelist our domain so we can load your resources.

</details>

<details>
<summary>Why is a test unstable when my component uses srcset?</summary>

The `srcset` attribute is a useful mechanism that provides the browser with a list of potential images to display, based on specified conditions such as media queries.

In most cases, Chromatic will capture the correct image from the `srcset` list. However, if multiple tests list the same image in their respective `srcset` lists, browser cache issues can result in unstable tests.

In situations like this, make the `srcset` URLs unique for each test by adding a query parameter value.

For instance, one test could use a `srcset` query parameter of `?cachebuster=1714593641616`.

```html
<picture>
  <source
    sizes="(max-width: 768px) 100vw, 50vw"
    type="image/webp"
    srcset="
​      https://placehold.co/384x384.webp?cachebuster=1714593641616 384w,
​      https://placehold.co/640x640.webp?cachebuster=1714593641616 640w,
​      https://placehold.co/750x750.webp?cachebuster=1714593641616 750w"
  />
  <img
    alt="Alt text"
    loading="eager"
    width="1500"
    height="1500"
    decoding="async"
    sizes="(max-width: 768px) 100vw, 50vw"
    src="https://placehold.co/3840x3840.jpeg"
    style="color: transparent;"
  />
</picture>
```

If another test uses the same images, they can alter the query parameter in the URL to `?currenttime=1714593641620`.

```html
<picture>
  <source
    sizes="(max-width: 768px) 100vw, 50vw"
    type="image/webp"
    srcset="
​      https://placehold.co/384x384.webp?currenttime=1714593641620 384w,
​      https://placehold.co/640x640.webp?currenttime=1714593641620 640w,
​      https://placehold.co/750x750.webp?currenttime=1714593641620 750w"
  />
  <img
    alt="Alt text"
    loading="eager"
    width="1500"
    height="1500"
    decoding="async"
    sizes="(max-width: 768px) 100vw, 50vw"
    src="https://placehold.co/3840x3840.jpeg"
    style="color: transparent;"
  />
</picture>
```

You can use any query parameter name as long as its value is unique to each test and stable across runs.

</details>

<details>
<summary>Why do my emojis look different in the snapshot versus on my machine?</summary>

Emojis are handled by your operating system's emoji font. Most operating systems use different emoji fonts, and those fonts tend to change over time. For example, if you view a story on a Mac, you'll see Apple’s set of emojis.

Chromatic captures Chrome and Firefox snapshots in a Linux environment. It includes a common set of emojis used by most systems. Those emojis will likely look different from emojis on a consumer OS like Mac or Windows. Unfortunately, there's no workaround available at this time.

</details>

<details>
<summary>Where are my videos?</summary>

Videos are interactive and time-based, which can make a test unstable. Chromatic hides videos by default to prevent false positives. You'll see the poster image, if specified, or a blank space where the video is supposed to render.

</details>

<details>
<summary>Why am I getting cross-origin errors with my stories?</summary>

Most likely, you are calling into `window.parent` somewhere in your code. As we serve your test preview iframe inside our `www.chromatic.com` domain, this leads to an `x-origin` error as your code doesn't have access to our frame (with good reason!).

Generally speaking it is a good idea to wrap calls like that in a `try { } catch` in case the code is running in a context where that's not possible (e.g., Chromatic).

</details>

### Layout and capture problems

<details>
<summary>Why does my snapshot shift by a few pixels between builds?</summary>

Text, padding, borders, or images may move between captures, even when your code hasn't changed.

If a flex or grid column has a dynamic width, try wrapping the story in a fixed-width decorator:

```js
decorators: [(Story) => (
  <div style={{ width: '800px' }}>
    <Story />
  </div>
)],
```

For vertical shifts, check whether the component uses `box-sizing: border-box`.

</details>

<details>
<summary>Why are borders missing from my snapshot, or shifting between builds?</summary>

If borders are missing or content shifts, check whether the component uses `box-sizing: border-box`.

Try these fixes:

- Add a fixed height to the decorator shown above.

- Add a [`play` function](/docs/interactions) that waits for the element to finish rendering.

</details>

<details>
<summary>Why do fractional element dimensions cause unstable tests?</summary>

Fractional computed dimensions can coincide with content shifts between captures.

If you find fractional widths or heights, try adjusting the styles so they resolve to whole numbers.

</details>

<details>
<summary>Why is my truncated text unstable?</summary>

Check whether JavaScript or CSS truncates the text.

**JavaScript truncation:** If the text changes after render, add a short [`delay`](/docs/delay) before capture. If the container width changes too, try a fixed-width decorator.

**CSS truncation:** If a transition changes the text after render, start the story in its final state or disable the transition for the test. See [animations](/docs/animations).

</details>

<details>
<summary>Why is my content being cut off vertically in my snapshots?</summary>

Make sure there are no elements inadvertently cutting off content through the use of overflow or height styles.

For elements that have relative height styles based on the size of the viewport (such as `height: 100vh`), all content nested under that element will appear in a snapshot unless either `overflow: hidden` or `overflow: scroll` is used to hide what is outside of that element (and therefore outside of the viewport).

When Chromatic captures a snapshot of an element that has a viewport-relative height and styling that hides or scrolls overflow, it uses a default viewport height of `900px`. This default applies only when Chromatic can't detect a natural height for the outermost DOM element (root ancestor), such as a scrollable `div`.

To set the height, you can add a decorator for stories that wraps them in a container with a fixed height:

```ts title="MyComponent.stories.js|jsx"
// Adjust this import to match your framework (e.g., nextjs, vue3-vite)
import type { Meta } from "@storybook/your-framework";

import { MyComponent } from "./MyComponent";

const meta = {
  component: MyComponent,
  title: "Example Story",
  decorators: [
    (Story) => (
      <div style={{ margin: "3em" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MyComponent>;
```

</details>

<details>
<summary>How do I capture content inside scrollable <code>divs</code>?</summary>

Scrollable divs constrain the height of their children. Change the height of the scrollable div to ensure all content fits. It's not possible for Chromatic to infer how tall scrollable divs are intended to be.

</details>

<details>
<summary>Why don't scrollbars appear in my snapshots?</summary>

Chromatic intentionally disables scrollbars during snapshot capture to focus on testing your content rather than browser UI elements. This ensures consistent snapshots across different browsers and operating systems, since scrollbar appearance varies significantly between platforms.

Unfortunately, there are currently no workarounds available to capture scrollbars in snapshots. This applies to both default browser scrollbars and custom-styled scrollbars using CSS.

If you're testing custom scrollbar styling or need to detect overflow issues, you may need to use alternative testing approaches outside of Chromatic's visual regression testing.

</details>

<details>
<summary>Why doesn't text alignment in my snapshot match my dev environment?</summary>

Text can appear slightly misaligned in a snapshot compared to what you see locally. This is most noticeable in components that mix icons and text, such as a button with a label between two icons.

First, ensure your [fonts load consistently in Chromatic](/docs/font-loading). If the capture environment falls back to a different font than your dev environment, text metrics (and therefore alignment) will shift.

If fonts aren't the cause, check for unwrapped text in a flex layout:

```html
<button>
  <svg><!-- icon --></svg>
  Small
  <svg><!-- chevron --></svg>
</button>
```

When you apply `display: flex` to a parent container (the `<button>` in this case), only its direct children become flex items. The two `<svg>` tags are element nodes, so they automatically become flex items that obey flex properties. Because the text "Small" is an anonymous text node, the browser wraps it in an anonymous flex item.

While the parent's `align-items` and `justify-content` will align this anonymous text alongside the icons, you cannot override or fine-tune its layout _individually_. Because there is no element wrapper around the word "Small", **you cannot write a CSS selector to target it**. This means you cannot apply specific fixes to it, such as:

- `align-self: center` (or `flex-end`) to override the parent's alignment for just that text.
- `margin-inline` or `padding` to add breathing room between the text and the icons without affecting them.
- `flex-grow` or `flex-shrink` to control how it behaves when space is tight, independently of the icons.
- `order` to change its position in the layout.

The anonymous flex item's size and baseline come entirely from font metrics, so any small difference in how the font renders between your machine and Chromatic's capture environment shows up as an alignment shift you cannot correct with a targeted CSS rule.

To fix it, wrap the text in an element so it becomes a regular flex item you can target:

```html
<button>
  <svg><!-- icon --></svg>
  <span>Small</span>
  <svg><!-- chevron --></svg>
</button>
```

</details>

<details>
<summary>Why isn’t my portal component (modal, dialog, popover, tooltip, or menu) captured? Or why is its snapshot cut off?</summary>

If you use an `animateIn` effect, set a [delay](/docs/delay) so Chromatic captures the snapshot after the animation completes.

Your component might be rendering outside of the viewport. Either reposition the component or adjust the [viewport size](/docs/modes/viewports/).

</details>

### Unexpected rendering behavior

<details>
<summary>Do you support taking snapshots of a component with multiple themes?</summary>

Yes. Chromatic's [Modes](/docs/modes) simplify visual testing for stories with different global configurations, such as themes. Follow the [Themes guide](/docs/themes) to get started.

</details>

<details>

  <summary>Why are stories with mocked data not being snapshotted correctly?</summary>

Chromatic snapshots sometimes show the initial or intermediate loading state of the UI, instead of the final state with the mocked data. This can lead to visual tests failing, even though the Storybook renders correctly locally. To debug this issue, follow these steps:

1. Ensure that MSW (Mock Service Worker) is correctly initialized by following the [MSW Storybook add-on setup instructions](https://github.com/mswjs/msw-storybook-addon?tab=readme-ov-file#configure-the-addon).

2. Confirm that you're not using outdated versions of `msw`, `msw-storybook-addon`, or any other community add-ons.

3. Run `npm run build-storybook` and `npx http-server storybook-static -o` locally to check the console and address any MSW warnings or errors. A setup that works locally can still fail in Chromatic.

4. Pay close attention to how you define MSW handlers, especially for API requests with query parameters. MSW recommends matching only the path in the handler URL and accessing query parameters inside the resolver function using `req.url.searchParams.get()`.

5. Ensure all necessary assets, such as CSS files, load correctly in your stories. Consider preloading them in [`.storybook/preview-head.html`](https://storybook.js.org/docs/configure/story-rendering#adding-to-head).

6. Add an [interaction test](/docs/interactions) to your story to assert that mocked data is present and the component is in the expected state before the test concludes.

7. Use [delays](/docs/delay) to ensure that mocked data is fully available before Chromatic takes a snapshot.

</details>

<details>
<summary>Why am I seeing a blank snapshot?</summary>

Blank snapshots are often caused by:

- **An `animateIn` effect**—If your component uses an `animateIn` effect, [set a delay](/docs/delay) so Chromatic captures the snapshot after the animation completes.

- **`position: fixed`**—Fixed-position elements may depend on viewport size but don't have dimensions themselves. Wrap your component in an element with defined height and width.

Learn how to [improve test stability](#improve-test-stability).

</details>

<details>
<summary>Why are ignored elements still causing diffs?</summary>

By default, Chromatic's diffing algorithm skips the DOM elements marked with either a `.chromatic-ignore` CSS class or `data-chromatic="ignore"` attribute.

If you're using this functionality but incoming changes are still captured, ensure that both the [baseline](/docs/branching-and-baselines) and new snapshots retain the same dimensions, including width, height, and relative positioning.

</details>

<details>
<summary>Why does my tab component make a test unstable?</summary>

Certain UI libraries like Material calculate the dimensions of each tab by measuring the rendered width of the tab's children using JavaScript (for example, via `getBoundingClientRect()`).

However, loading a custom font can make the test unstable. Fonts affect the dimensions of text within tabs. Because custom fonts can load before, during, or after the tab component, the dimensions calculated by the component can vary across runs.

The solution we recommend is to use a `<link rel="preload">` in your [`.storybook/preview-head.html`](https://storybook.js.org/docs/configure/story-rendering#adding-to-head) to preload the font before the story renders. This ensures that the dimensions of the contents inside of the tab component remain consistent when measured.

</details>

<details>
<summary>Why do fonts in my graph component make a test unstable?</summary>

Certain charting libraries like Highcharts measure the available space to determine where elements should be laid out.

Loading a custom font can make the test unstable. Fonts can load before, during, or after the component, and different fonts have different rendered dimensions.

The solution we recommend is to use a `<link rel="preload">` in your [`.storybook/preview-head.html`](https://storybook.js.org/docs/configure/story-rendering#adding-to-head) to preload the font before the story renders. This ensures that the dimensions and position of the fonts inside of the graph component remain consistent.

</details>
