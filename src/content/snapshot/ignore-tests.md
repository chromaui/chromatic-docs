---
title: Ignore tests
description: Manually ignore a test to unblock a build without accepting unexpected changes.
sidebar: { order: 8 }
slug: 'ignore-tests'
---

# Ignore tests

Sometimes a test shows a change you're not ready to deal with, for example: an unexpected diff from an unrelated commit, or a new story that isn't ready for review. Ignoring it gets your build passing while you deal with the change later.

<div class="aside">

Looking for a different kind of ignore? [Flake Filter](/docs/flake-filter) automatically ignores unstable tests. You can also [ignore specific elements](/docs/ignoring-elements) within a snapshot, or [disable snapshots](/docs/disable-snapshots) for tests you never want captured.

</div>

To ignore a test, open the context menu on the test's page and select **Ignore test on this build**.

![The three-dot action menu on a test page showing the Ignore test on this build option.](../../images/ignore-test.png)

If you change your mind, you can un-ignore the test to return it to the unreviewed state on the same build.

![An ignored test showing the Ignored badge and the undo button.](../../images/ignore-test-ignored.png)

**Ignoring is scoped to a single build:** an ignored test is captured and compared as usual on future builds. Ignoring a test also doesn't affect your [baselines](/docs/branching-and-baselines) unless you take action to accept or deny it.
