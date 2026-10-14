---
name: docs-images
description: Create or update screenshots and annotated UI images for the Chromatic docs in the "Chromatic Docs Images" Figma file, then export them into src/images/. Use whenever a docs page needs a new or refreshed image, product screenshot, annotated screen, or "picture of the UI" — including requests to wrap UI in a browser window, crop a screen to one control, point at something with an arrow, highlight a button, or show a click with a mouse pointer — even if the user doesn't mention Figma.
---

# Chromatic docs images

Docs images are built in Figma, not captured as screenshots. Each image is a frame composed from Chromatic library components, optionally wrapped in a browser window and annotated, then exported as a PNG into `src/images/`.

- **File:** `https://www.figma.com/design/YlwuIXSLt3NpboT7veMGz7/Chromatic-Docs-Images` (fileKey `YlwuIXSLt3NpboT7veMGz7`, one page, "Page 1")
- **Tools:** Figma MCP. Load the `figma-use` skill (or `skill://figma/figma-use/SKILL.md`) before your first `use_figma` call, and pass its name in `skillNames`. `figma-use` also asks you to load `figma-generate-design`. Of that skill, only the `search_design_system` and component-import parts apply here. Its page-building workflow doesn't.
- **Helpers:** `references/snippets.md` has tested Plugin API code for every pattern below. Copy from it rather than re-deriving the geometry; the numbers are fiddly and the snippets encode them.

## 1. Pick the section first

Every image lives inside a Figma **section** named for the docs topic ("Quarantine", "Modes", "Accessibility", "Billing & invoices", …). Sections are top-level children of the page.

If the user names a section, use it. If they don't, **ask before building anything**: list the existing section names (snippet `listSections`) and suggest the one that matches the docs page, or offer to create a new section. Don't guess silently. An image dropped in the wrong section is hard for the team to find later, and stray top-level frames clutter the canvas.

Inside the section, frames sit at about `x = 100` and stack vertically with ~100px gaps. Place the new frame below or beside the existing ones without overlapping anything, and grow the section if the frame pokes out (sections don't auto-grow). The `placeInSection` snippet does this.

## 2. Name the frame after its file

The frame name is the PNG filename: kebab-case, no extension, e.g. `quarantine-test-quarantined` → `src/images/quarantine-test-quarantined.png`. Prefer `<area>-<screen>-<state>` like the existing names (`browser-buildscreen-notification`, `collaborators-project-git`). Check `src/images/` (and subfolders like `a11y/`) for an existing file of the same name. Reusing a name replaces an image that's already published, so only do it on purpose.

Give the frame a PNG export setting at **2×** (`{format: 'PNG', constraint: {type: 'SCALE', value: 2}}`). That's what ~75% of the file uses, and it keeps text crisp on retina screens.

## 3. Compose the UI from the Chromatic library

Build the screen from components in the **Chromatic** team library (`search_design_system` with `includeLibraryKeys` set to the Chromatic key in snippets). Before composing from scratch, search for a whole-screen or whole-panel component first (e.g. `Builds / Builds`, `BuildHeader`, `Row / Build`, `Header`), because a ready-made screen is faster and more faithful. Then set instance properties and override text so the state matches what the docs page describes.

Screenshot a whole-screen component right after inserting it. Some library screens render broken when freshly instanced (values in the wrong columns, split progress bars). If one does, use the copy of that screen already in the file instead. Also scan for leftover placeholder text ("Status text", "Label", "Title") and hide or replace it.

Avoid anything from **"Chromatic UI - DEPRECATED"**, "Theming - DEPRECATED" or other `DEPRECATED` libraries, even though they show up in search. They're the old visual style and make new images look inconsistent next to current ones.

Web app screens are **1200px wide**, with `#F6F9FC` (rgb 246,249,252) or white page backgrounds, the `Header` (`Type=Logged in`) on top, and the left `Projects` sidebar where the real page has one. Use realistic sample data: project "acme", org "hichroma", stories like `ArticleCard` and `Button`. Avoid lorem ipsum or "Test 1".

Look at an existing image in the same section for reference (`get_screenshot` on it) before composing. Matching its density and content conventions matters more than anything in this file.

**Reuse an existing screen when one is close.** If another image already shows the right screen (a build page, a test page), cloning its _UI content_ and editing text and state is often faster than composing. Clone only the UI, then re-wrap and re-annotate it with the snippets. Don't duplicate the whole old image frame: many older images use a hand-drawn chrome, 1.5× export, or crops and arrows that don't meet the rules below, and copying the frame carries those problems into the new image.

**If the UI doesn't exist yet, ask.** When neither the library nor existing images contain the control the user wants (a new feature, a renamed button), don't invent it. Ask for a screenshot, a design link, or a description of where it sits and what it says. A made-up control in the docs misleads readers.

### Rebuilding UI from a feature's design file

New features usually come with their own Figma file. `use_figma` runs against one file per call, so you can't copy layers across. Rebuild the UI in the docs file from the same library components instead:

1. In the **design file**, run a read-only `use_figma` over the frames you need and collect, for each instance: `getMainComponentAsync()` → `key` (and the parent set's key for variants), `componentProperties` values, visible text by node name, and any text fill colours (status text like "Disabled" or "Enabled" is often recoloured per instance). Snippet `readDesignInstances`.
2. In the **docs file**, import each by key (`importComponentByKeyAsync`) and re-apply the properties, text and colours. Local frames in the design (forms, wrappers) are rebuilt with auto-layout using the sizes from `get_design_context`.
3. **Expect the library to have drifted.** The design was made against an older library version, and newer versions often turn on defaults the design never had: an image or icon slot, a second "Action" button, a password "Show" toggle. Reading the design's properties tells you what it set, not what the new version adds. So after the first screenshot, compare it with the design screenshot side by side, then turn off every boolean slot the design doesn't show, hide extra buttons, and fix any shape changes (e.g. a button that's a pill in the library but squared to sit under a field in the design).
4. Use realistic sample data (`acme`, `billing@acme.com`) in place of the designers' real email addresses or names.

### Showing one section of a long page

To show a section in the middle of a page (an "Alerts" card halfway down Billing), build only that section and treat the page as scrolled. Put the section's title ~40px below the top of the UI frame, so the empty margin reads as the gap after the previous section, then use a crop with the top bar and right edge pinned. The header and sidebar have scrolled out of view or sit off-frame to the left, so you don't need to rebuild them. Make the crop wide enough for the section (≈1150 for a 1060px card) and check that **none of the traffic-light dots** peek in at the left of the top bar; a single stray dot looks like a glitch. Either hide all three or show all three.

When aiming annotations, target the **instance** that holds the label, not the text node. Buttons are usually instances named generically (`Button`), so match an instance that contains the label text (see the `cropFrame` example in snippets). Give any overlays you add (tooltips, menus) clear names so later lookups aren't ambiguous. A `use_figma` script that throws is rolled back entirely, so a failed build leaves nothing behind to clean up.

## 4. Choose a presentation

Pick based on what the reader needs to see:

| Reader needs to…                               | Use                                                      | Typical size                    |
| ---------------------------------------------- | -------------------------------------------------------- | ------------------------------- |
| Orient on a whole page                         | **Browser chrome**                                       | outer frame ~1282 wide          |
| Find one control or menu                       | **Cropped**                                              | small fixed frame, e.g. 560×286 |
| Notice specific rows/elements in a busy screen | Browser chrome + **arrows**                              | —                               |
| Know which button to press                     | Cropped or chrome + **highlight box** and/or **pointer** | —                               |

Annotations combine freely (the Quarantine images use crop + pointer + highlight box). Use them sparingly, though: one to four marks per image. Each mark should answer "where do I look?" for a step in the docs text.

### Browser chrome

Wrap full screens in the `BrowserChrome` instance from the "Example Components" library (snippet `wrapInBrowser`). The point is a seamless fit, so the UI must look like it _is_ the browser's page:

- The chrome has a 1px inside border and a 30px title bar, so the UI area starts at `(chrome.x + 1, chrome.y + 32)`, is `chrome.width − 2` wide and `chrome.height − 33` tall. A 1200px screen means a **1202px** chrome.
- Put the UI inside a **clip frame** with exactly those bounds, `clipsContent = true`, and corner radii **top 0, bottom 7**. The chrome's radius is 8, so 7 sits flush inside the 1px border. Without the bottom radii the UI's square corners poke past the rounded window; without clipping, tall screens spill out the bottom.
- Size the chrome to the content you want to show, not the other way round. If the screen is taller than needed, shorten the chrome and let the clip frame cut the UI off cleanly.
- Set `Show browser controls` to false and keep the address as `chromatic.com`, matching the existing images.
- Outer image frame: white fill, chrome inset ~40px left/right and ~20px top, with ~60–80px below for the drop shadow to fall into. If arrows enter from the left, widen the left inset (the Modes images use 66px).

### Cropped UI

For a single control, show a small window into a full browser-wrapped screen (snippet `cropFrame`):

- Outer frame at a fixed small size (560×286 is the house size for button and menu crops), fill `#F6F9FC`, `clipsContent = true`.
- Always show the browser's **top bar and right edge**, each exactly **25px** in from the crop edge, so the reader sees a window corner. The rest bleeds off-frame. In a 560×286 crop, this puts the browser at (−667, 25), which is where the Quarantine images sit. If the target is on the left side of the app, show the top bar and **left** edge instead.
- **Pin the window and scroll the page.** When the control is far down the screen, don't move the browser up to reach it, because that pushes the top bar out of the crop. Keep the browser pinned and move the UI up _inside the clip frame_, as if the reader had scrolled. `cropFrame` does this.
- If the control is too far from the pinned edge to fit (e.g. mid-screen in a 560px crop), widen the crop rather than giving up the window edges.

### Arrows

Arrows are the house orange gradient arrow: `#FF4400` fading to transparent at the tail, 159px long, with two soft drop shadows. **Clone the reference arrow** (node `1:20187`) rather than drawing one, so every arrow in the docs is identical (snippet `addArrow`).

- Rotation sets direction: `-90` points right (the usual: entering from the left margin), `90` left, `0` down, `180` up.
- Keep the default length. Resizing distorts the head.
- Make arrows children of the **outer image frame**, above the browser. Place the tip ~8–12px short of the element it points at, vertically centred on it. The tail can start in the frame margin outside the browser; that's intended.
- **The whole arrow must be inside the image frame, including the faded tail.** A clipped arrow loses its gradient and looks broken. If there isn't room, widen the frame margin on that side (that's why the Modes images use a 66px left inset) or point from another direction. `addArrow` throws if the arrow would be clipped.
- For a list of rows, use one arrow per row, all aligned on the same x.

### Highlight box

To outline a button, field or panel, use a rectangle with no fill, a 2px `#FF4400` stroke aligned **OUTSIDE**, and a corner radius that matches the element (4 for cards and panels, a full pill radius for pill buttons). It sits exactly over the element's bounds as a child of the outer frame (snippet `addHighlight`).

### Mouse pointer

To show a click or hover, use the `pointer` component (variants: `handpointalt` for clicking buttons, `handpoint`, `arrow`, `text`, `handopen`, `handclosed`, `crosshair`, `notallowed`, `rowresize`). The library key no longer resolves, so **clone the reference instance** (node `1978:120448`) and set `type` (snippet `addPointer`). Make it the last child of the outer frame so it renders above everything. Place it so the fingertip lands on the control, slightly below its centre, the way a real cursor would. The hand draws about 24px above the instance's `y`. `addPointer` corrects for this, but if you place the pointer by hand, check the screenshot. If the click opens something in place (a menu, a popover), show it open, because that's what the reader will see next. If the click navigates to another screen, leave the button in its normal state.

The same goes for supporting state with no click involved. If the docs point is only visible in a tooltip or popover (e.g. TurboSnap's captured vs copied counts), open it. Existing images like `build-turbosnap` do this. Don't add state that doesn't serve the docs point.

## 5. Check it, then export

1. Screenshot the finished frame (`await frame.screenshot()`) and look hard at: UI corners flush with the browser's rounded bottom, no gap or overlap at the top bar, the browser's whole bottom edge and shadow visible (full-screen images), the top bar and side edge visible (crops), whole arrows with their tails, arrow tips and fingertips on the right thing, text overrides correct. Fix what's off, then screenshot once more.
2. Export with `download_assets` (fileKey + frame nodeId). It honours the frame's export settings. Download the `export` URL straight to `src/images/<frame-name>.png` with `curl -sL -o`. URLs are short-lived, so fetch right away.
3. If the user is working on a docs page, give them the Markdown line, with alt text that says what the image shows and why it matters:
   `![The build screen with two unreviewed stories in Firefox.](../../images/<frame-name>.png)`
4. Report the Figma link to the frame (`…?node-id=<id with : → ->`), the PNG path, and its pixel size.

## Updating an existing image

Find the frame by name in its section, duplicate it if the old version should stay, and edit the instances and text in place. Keep the frame's name, size and export settings unless the user asks otherwise, so the docs page doesn't need changing. Re-export over the existing PNG.

**When the UI was redesigned**, editing the old frame in place rarely works: old images often use deprecated components and sizes. Build a new frame with the same name instead. Then rename the old one `<name>-legacy` and clear its `exportSettings`, so two frames never export to the same file. Place the new frame beside the old one. Don't delete the old frame unless the user asks.
