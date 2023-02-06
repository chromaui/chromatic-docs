---
layout: default
title: Browsers
description: Enable visual testing with multiple browsers
---

# Browser support

UIs might look perfect in one browser but be broken in another. Chromatic helps you extend your test coverage to Chrome, Firefox, Safari, and Edge in one click.

## Enable new browsers

Go to the "Manage" screen and click to enable another browser. Chrome is enabled by default.

![Enable firefox in Chromatic](img/browser-managescreen-enable-firefox.png)

Chromatic will create baselines for the newly enabled browser on the next test run. Previously accepted stories in Chrome will be auto-accepted as baselines in the new browser. You'll want to make sure your builds pass before enabling a new browser.

<video autoPlay muted playsInline loop width="560px" class="center">
  <source src="img/browser-buildscreen-multiple-browsers-inprogress.mp4" type="video/mp4" />
</video>

The new browser's snapshots will be marked as "New" on the Build page, and you will now be able to view them during [review](review).

![New Firefox snapshot in Chromatic](img/browser-snapshotscreen-new-firefox-snapshot.jpg)

Your team can also see how a story renders in a given browser across different builds and branches on the component screen.

<video autoPlay muted playsInline loop width="560px" class="center">
  <source src="img/browser-componentscreen-toggle-snapshots.mp4" type="video/mp4" />
</video>

Congratulations, you enabled a new browser! From now on, our Capture Cloud will spin up as many Chrome, Firefox, Safari, or Edge machines as you need to test your Storybook in the least amount of time.

## Verify UI changes across browsers

When Chromatic tests detect a visual change to a story in any enabled browser, you'll get notified. For instance, if you have a `TooltipMessage:default` story tested in Chrome and Firefox, you'll get a notification when changes happen in either browser.

![Notification of changes in Firefox snapshot](img/browser-buildscreen-notification.jpg)

You can see changes for the browser's snapshot in the [review](review#find-your-pull-request) workflow.

![Changes in Firefox snapshot](img/browser-snapshotscreen-diff-in-firefox-snapshot.jpg)

Once you accept changes to the story, its baselines are updated. Each story has one baseline for Chrome, and it can also have baselines for Firefox, Safari, and Edge.

<div class="aside">If you test responsiveness with the viewport parameters, baselines are associated with each viewport, and those can have a Chrome, Firefox, Safari or Edge baseline.</div>

## Browser upgrades

Chromatic's infrastructure is periodically updated to use the latest **stable** browser version (can be behind the latest version). When an infrastructure upgrade is available, you'll see a notification in your project's dashboard.

Upgrades can cause subtle changes in story appearance due to the underlying rendering engine changes. We try to make upgrades as easy as possible by auto-migrating your test baselines. Learn more about [infrastructure upgrades](infrastructure-upgrades) and view [browser versions](infrastructure-release-notes).

---

### Frequently asked questions

<details>
<summary>Does Chromatic tell me when snapshots are different between browsers?</summary>

This has significant trade-offs. Teams that try to verify consistency across browsers end up encountering false positives due to inherent browser/device/OS differences (e.g., font rendering, anti-aliasing) or require workarounds like adjusting the [diff thresholds](threshold), resulting in false positives.

Chromatic does not programmatically compare snapshots from different browsers against each other. Instead, we compare the snapshots for each browser against the baseline for that browser.

</details>

<details>
<summary>Does Chromatic support specific browser versions?</summary>

Chromatic does not support running tests on specific browser versions. While building Chromatic's Capture Cloud, we found that not all browser versions are created equal. Some contain bugs that lead to rendering inconsistencies. We aim to take care of these details so that you don't have to, giving you consistently flake-free tests.

We extensively test new browser versions and modify our infrastructure to handle well-known inconsistencies between them. Our goal is to provide you with the latest stable version of each of our supported browsers on a timely schedule with a painless upgrade experience between them.

That said, we don't support outdated browser versions since our users are [automatically upgraded](infrastructure-upgrades#how-to-upgrade-your-project) to the latest versions after the upgrade window ends, simplifying your infrastructure and customer support.

</details>
