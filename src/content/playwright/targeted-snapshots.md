---
title: Targeted snapshots
slug: playwright/targeted-snapshots
description: Learn how to capture snapshots at specific points during your Playwright tests programmatically
sidebar: { order: 2 }
---

# Take targeted snapshots with Playwright

By default, Chromatic takes a snapshot at the end of every Playwright test, whether it passes or fails. However, you can also choose to programmatically take snapshots at specific points in your tests using the `takeSnapshot` function inside your test runs.

`takeSnapshot` is especially useful for capturing a snapshot of your UI’s appearance when your UI reaches a specific state mid-test:

```js title="tests/Example.spec.js|ts"
import { test, expect, takeSnapshot } from "@chromatic-com/playwright";

// 👇 Add testInfo parameter
test("Can filter product", async ({ page }, testInfo) => {
  await page.goto("/restaurant/dp/B07KMG72");

  await page.locator(".menu__item:first-of-type").click();

  // Call takeSnapshot to take an archive "snapshot"
  // of the page at this point in the test.
  // 👇 Pass testInfo to takeSnapshot
  await takeSnapshot(page, testInfo); // [!code highlight]

  // Continue with the test.
  await page.getByRole("link", { name: "Add to cart" }).click();

  // You can call takeSnapshot multiple times if necessary.
  // To help disambiguate, you can give the snapshot a name,
  // which is passed as the second argument to takeSnapshot.
  await takeSnapshot(page, "After adding to cart", testInfo); // [!code highlight]

  await expect(page).toHaveTitle(/Cart/);
});`
```
