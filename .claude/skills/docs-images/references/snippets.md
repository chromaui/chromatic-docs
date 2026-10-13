# Plugin API snippets for docs images

Paste the helpers you need at the top of a `use_figma` script. Each call starts on "Page 1", the only page, so no page switching is needed. All helpers were tested against the live file.

## Constants

```js
const FILE_KEY = 'YlwuIXSLt3NpboT7veMGz7';
const CHROMATIC_LIBRARY_KEY =
  'lk-8ad627e9288b19bbd0dd215c3f1c6d291b322d9295292af9954b1c651d53fd1c91f241ac956eadc5633bf5972c112dc38dc87c3ace476f0ecea880014436b982'; // for search_design_system includeLibraryKeys
const BROWSER_CHROME_SET_KEY = 'df77539fc53aeb669c80800821aaf8796f84b711'; // "Example Components" library
const REF_ARROW_ID = '1:20187'; // orange gradient arrow in Modes › modes-buildscreen
const REF_POINTER_ID = '1978:120448'; // pointer instance in Quarantine › quarantine-test-quarantined
const ORANGE = { r: 1, g: 68 / 255, b: 0 }; // #FF4400
const APP_BG = { r: 246 / 255, g: 249 / 255, b: 252 / 255 }; // #F6F9FC
const WHITE = { r: 1, g: 1, b: 1 };
```

## listSections

```js
return figma.currentPage.children
  .filter((n) => n.type === 'SECTION')
  .map((s) => ({
    id: s.id,
    name: s.name,
    frames: s.children.filter((c) => c.type === 'FRAME').map((c) => c.name),
  }));
```

## placeInSection

Appends `frame` to `section` below its lowest child, and grows the section to fit.

```js
function placeInSection(section, frame, gap = 100) {
  const kids = section.children.filter((c) => c !== frame);
  const bottom = kids.length ? Math.max(...kids.map((c) => c.y + c.height)) : 0;
  section.appendChild(frame);
  // Line up with the column the section's frames already use (usually 100, sometimes 110–122).
  const xs = kids.map((c) => Math.round(c.x));
  frame.x = xs.length
    ? xs.sort((a, b) => xs.filter((v) => v === b).length - xs.filter((v) => v === a).length)[0]
    : 100;
  frame.y = kids.length ? bottom + gap : 100;
  const needW = frame.x + frame.width + 100,
    needH = frame.y + frame.height + 100;
  if (needW > section.width || needH > section.height) {
    section.resizeWithoutConstraints(
      Math.max(section.width, needW),
      Math.max(section.height, needH)
    );
  }
}
```

## newImageFrame

```js
function newImageFrame(name, w, h, fill = WHITE) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(w, h);
  f.fills = fill ? [{ type: 'SOLID', color: fill }] : [];
  f.clipsContent = true;
  f.exportSettings = [{ format: 'PNG', constraint: { type: 'SCALE', value: 2 } }];
  return f;
}
```

## wrapInBrowser

Wraps a UI node (normally 1200 wide) in BrowserChrome with the exact flush fit. `visibleHeight` is how much of the UI to show; defaults to the UI's full height. Returns `{ group, chrome, clip }`. `group` is a transparent frame sized to the chrome; position it inside the image frame.

```js
async function wrapInBrowser(ui, visibleHeight = ui.height) {
  const set = await figma.importComponentSetByKeyAsync(BROWSER_CHROME_SET_KEY);
  const chrome = set.children.find((c) => c.name === 'inverse=false').createInstance();
  const props = chrome.componentProperties;
  const key = (p) => Object.keys(props).find((k) => k.startsWith(p));
  chrome.setProperties({
    [key('Show browser controls')]: false,
    [key('address')]: 'chromatic.com',
  });

  const w = ui.width + 2,
    h = visibleHeight + 33; // 1px border each side, 30px bar + 1px border top + 1px gap, 1px border bottom
  chrome.resize(w, h);

  const clip = figma.createFrame();
  clip.name = 'clip-frame';
  clip.fills = [];
  clip.clipsContent = true;
  clip.resize(w - 2, h - 33);
  clip.topLeftRadius = 0;
  clip.topRightRadius = 0;
  clip.bottomLeftRadius = 7;
  clip.bottomRightRadius = 7; // chrome radius 8 − 1px border

  const group = figma.createFrame();
  group.name = 'browser';
  group.fills = [];
  group.clipsContent = false; // let the chrome's drop shadow show
  group.resize(w, h);
  group.appendChild(chrome);
  chrome.x = 0;
  chrome.y = 0;
  group.appendChild(clip);
  clip.x = 1;
  clip.y = 32;
  clip.appendChild(ui);
  ui.x = 0;
  ui.y = 0;
  return { group, chrome, clip };
}
```

Standard padded layout for a full-screen image:

```js
const { group } = await wrapInBrowser(ui, 800);
const img = newImageFrame('my-image-name', group.width + 80, group.height + 20 + 70);
img.appendChild(group);
group.x = 40;
group.y = 20;
```

## cropFrame

Shows a small window into a wrapped screen, always with the browser's **top bar and one side edge** visible at exactly `edge` px inside the crop. That's how the reader can tell it's a window corner. The browser stays pinned and the **page scrolls inside it**: the UI moves up inside the clip frame until `target` (a node inside the UI) is vertically in view. The side is `'right'` when the target is in the right half of the screen (the usual case) and `'left'` otherwise. Wrap the UI with `visibleHeight >= h` so the window reaches the bottom of the crop.

Returns `{ img, fits }`. If `fits` is false, the target is too far from the pinned side to show in a 560px-wide crop. Widen the crop (`w`) rather than giving up the window edges.

```js
function cropFrame(name, wrapped, target, { w = 560, h = 286, edge = 25, side } = {}) {
  const { group, clip } = wrapped;
  const ui = clip.children[0];
  const img = newImageFrame(name, w, h, APP_BG);
  img.appendChild(group);
  const ub = ui.absoluteBoundingBox,
    tb = target.absoluteBoundingBox;
  const t = { x: tb.x - ub.x, y: tb.y - ub.y, w: tb.width, h: tb.height };
  side = side || (t.x + t.w / 2 > ui.width / 2 ? 'right' : 'left');
  // Pin the window: top bar `edge` px from the top, chosen side `edge` px from that side.
  group.y = edge;
  group.x = side === 'right' ? w - edge - group.width : edge;
  // Scroll the page so the target sits a little above the middle of the visible area.
  const visH = h - (edge + 32);
  let scroll = t.y + t.h / 2 - visH * 0.45;
  scroll = Math.max(0, Math.min(scroll, ui.height - visH));
  ui.y = -Math.round(scroll);
  const tx = group.x + 1 + t.x;
  return { img, fits: tx >= 0 && tx + t.w <= w };
}
```

Example:

```js
const wrapped = await wrapInBrowser(ui, 286);
// Buttons are usually instances named 'Button'. Match on the label text inside them.
const btn = ui.findOne(
  (n) =>
    n.type === 'INSTANCE' &&
    n.name === 'Button' &&
    !!n.findOne((t) => t.type === 'TEXT' && t.characters === 'Verify changes')
);
const { img, fits } = cropFrame('build-verify-changes-click', wrapped, btn);
```

## absolute placement helper

Rotation makes `x`/`y` unintuitive. This moves any node so its visual bounding box's top-left lands at `(x, y)` in its parent's coordinates.

```js
function placeVisual(node, x, y) {
  const bb = node.absoluteBoundingBox,
    pb = node.parent.absoluteBoundingBox;
  node.x += pb.x + x - bb.x;
  node.y += pb.y + y - bb.y;
}
// Absolute rect of a node expressed in `frame`'s coordinates (use to aim annotations at UI elements)
function rectIn(node, frame) {
  const a = node.absoluteBoundingBox,
    f = frame.absoluteBoundingBox;
  return { x: a.x - f.x, y: a.y - f.y, w: a.width, h: a.height };
}
```

## addArrow

Points at `target` (a rect in `img` coordinates, e.g. from `rectIn`). `dir` is where the arrow points: `'right'` (enters from the left, the common case), `'left'`, `'down'`, `'up'`.

```js
async function addArrow(img, target, dir = 'right', gap = 10) {
  const ref = await figma.getNodeByIdAsync(REF_ARROW_ID);
  const a = ref.clone();
  img.appendChild(a);
  a.name = 'arrow';
  a.rotation = { right: -90, left: 90, down: 0, up: 180 }[dir];
  const bb = a.absoluteBoundingBox; // visual size after rotation
  const cx = target.x + target.w / 2,
    cy = target.y + target.h / 2;
  const pos = {
    right: [target.x - gap - bb.width, cy - bb.height / 2],
    left: [target.x + target.w + gap, cy - bb.height / 2],
    down: [cx - bb.width / 2, target.y - gap - bb.height],
    up: [cx - bb.width / 2, target.y + target.h + gap],
  }[dir];
  placeVisual(a, pos[0], pos[1]);
  // The faded tail is part of the arrow, so the whole arrow must sit inside the image frame.
  const ab = a.absoluteBoundingBox,
    fb = img.absoluteBoundingBox;
  const clipped =
    ab.x < fb.x ||
    ab.y < fb.y ||
    ab.x + ab.width > fb.x + fb.width ||
    ab.y + ab.height > fb.y + fb.height;
  if (clipped)
    throw new Error(
      `arrow ${dir} would be clipped by ${img.name}; widen the frame margin or change direction`
    );
  return a;
}
```

## addHighlight

```js
function addHighlight(img, target, radius = 4) {
  const r = figma.createRectangle();
  img.appendChild(r);
  r.name = 'highlight';
  r.resize(target.w, target.h);
  r.x = target.x;
  r.y = target.y;
  r.fills = [];
  r.strokes = [{ type: 'SOLID', color: ORANGE }];
  r.strokeWeight = 2;
  r.strokeAlign = 'OUTSIDE';
  r.cornerRadius = radius; // match the element; pill buttons → target.h / 2
  return r;
}
```

## addPointer

`type`: `handpointalt` (clicking a button, the default), `handpoint`, `arrow`, `text`, `handopen`, `handclosed`, `crosshair`, `notallowed`, `rowresize`.

**Gotcha:** the hand vector is flipped inside the component, so it draws about **24px above** the instance's `y`, and `absoluteRenderBounds` doesn't report it. Measured fingertip for `handpointalt`: `(x + 10, y − 23)`. The helper accounts for this. For other variants, check a screenshot and adjust.

```js
async function addPointer(img, target, type = 'handpointalt') {
  const ref = await figma.getNodeByIdAsync(REF_POINTER_ID);
  const p = ref.clone();
  img.appendChild(p); // last child → renders on top
  p.name = 'pointer';
  p.setProperties({ type });
  // Small icon buttons: aim at the centre. Wider labelled buttons: aim right of centre so the label stays readable.
  const tip = {
    x: target.x + target.w * (target.w > 48 ? 0.82 : 0.5),
    y: target.y + target.h * 0.55,
  };
  p.x = Math.round(tip.x - 10);
  p.y = Math.round(tip.y + 23);
  return p;
}
```

## Export to the repo

After the frame looks right, call `download_assets` with `fileKey` and the frame's `nodeId` (no format/scale overrides, so the frame's 2× PNG setting applies), then:

```bash
curl -sL -o src/images/<frame-name>.png "<export url>"
file src/images/<frame-name>.png   # confirm it's a PNG at 2× the frame size
```
