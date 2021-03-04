---
layout: default
title: Browsers
description: Enable visual testing with multiple browsers
---

# Browser support

UIs might look perfect in one browser but be broken in another. Chromatic helps you extend your test coverage to Chrome, Firefox, and IE11 in one click.

## Enable new browsers

Go to the "Manage" screen and click to enable another browser. Chrome is enabled by default.

![Enable firefox in Chromatic](img/browser-managescreen-enable-firefox.png)

On the next test run, Chromatic will create baselines for the newly enabled browser. Previously accepted stories in Chrome will be auto-accepted as baselines in the new browser. You'll want to make sure your builds pass before enabling a new browser.

<video autoPlay muted playsInline loop width="560px" class="center">
  <source src="img/browser-buildscreen-multiple-browsers-inprogress.mp4" type="video/mp4" />
</video>

The new browser's snapshots will be marked as "New" on the Build page and you will now be able to view it during review.

![New Firefox snapshot in Chromatic](img/browser-snapshotscreen-new-firefox-snapshot.jpg)

Your team can also see how a story renders in a given browser across different builds and branches on the component screen.

<video autoPlay muted playsInline loop width="560px" class="center">
  <source src="img/browser-componentscreen-toggle-snapshots.mp4" type="video/mp4" />
</video>

Congratulations you enabled a new browser! From now on our Capture Cloud will spin up as many Chrome, Firefox, or IE11 machines as you need to test your Storybook in the least amount of time.

---

## Verify UI changes across browsers

When Chromatic tests detect a visual change to a story in any enabled browser you'll get notified. For instance, if you have a `TooltipMessage:default` story that is tested in Chrome and Firefox, you'll be notified when changes happen in either Chrome or Firefox.

![Notification of changes in Firefox snapshot](img/browser-buildscreen-notification.jpg)

You can see changes for the browser's snapshot in the review workflow.

![Changes in Firefox snapshot](img/browser-snapshotscreen-diff-in-firefox-snapshot.jpg)

Once you accept changes to the story, its baselines are updated. Each story has one baseline for Chrome, it can also have baselines for Firefox and IE11.

<div class="aside">If you test responsiveness with the viewport parameters, baselines are associated with each viewport, and those can have a Chrome, Firefox, or IE11 baseline.</div>

---

### Frequently asked questions

<details>
<summary>Does Chromatic tell me when snapshots are different between browsers?</summary>

This has significant trade offs. Teams that try to verify consistency between browsers end up encountering false positives due to inherent browser/device/OS differences like anti-aliasing and font rendering. Or they require workarounds like loosening diff thresholds which result in false negatives.

Chromatic does not programmatically compare snapshots from different browsers against each other. Instead, we compare the snapshots for each browser against the baseline for that browser.

</details>

<details>
<summary>Why can't i see any snapshots when i use IE11?</summary>

This could be related to usage of MDX based stories. This is a recent issue that we're aware and working towards fixing as soon as possible. All other story formats should not be impacted in any way.

</details>
