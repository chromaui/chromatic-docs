---
title: Targeted snapshots
slug: vitest/targeted-snapshots
description: Learn how to capture snapshots at specific points during your Vitest tests programmatically
sidebar: { order: 2 }
---

# Take targeted snapshots with Vitest

By default, Chromatic takes a snapshot at the end of every Vitest test, whether it passes or fails. However, you can also choose to programmatically take snapshots at specific points in your tests using the `takeSnapshot` function inside your test runs.

`takeSnapshot` is especially useful for capturing a snapshot of your UI’s appearance when your UI reaches a specific state mid-test:

```tsx title="test/accordion.test.tsx"
import { test, expect } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { takeSnapshot } from "@chromatic-com/vitest"; // [!code highlight]
import { Accordion } from "../src/components/Accordion";

test("Can open accordon", async () => {
  await render(<Accordion header="Example header">Example content</Accordion>);

  const toggle = page.getByRole("button", { name: "Example header" });
  const content = page.getByText("Example content");

  // Open accordion, content should become visible
  await toggle.click();
  await expect.element(content).toBeInTheDocument();

  // Call takeSnapshot to take an archive "snapshot"
  // of the component at this point in the test.
  await takeSnapshot(); // [!code highlight]

  // Close accordion, content should become hidden
  await toggle.click();
  await expect.element(content).not.toBeInTheDocument();

  // You can call takeSnapshot multiple times if necessary.
  // To help disambiguate, you can give the snapshot a name,
  // which is passed as the first argument to takeSnapshot.
  await takeSnapshot("closed"); // [!code highlight]
});
```

Chromatic integration provides `waitForIdleNetwork` utility function that can be used before you take manual snapshots.
It will resolve once network has been idle for given time, meaning no new network requests started during that period.

```tsx title="test/accordion.test.tsx"
import { test, expect } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { takeSnapshot, waitForIdleNetwork } from "@chromatic-com/vitest"; // [!code highlight]
import { Accordion } from "../src/components/Accordion";

test("image inside accordion", async () => {
  await render(
    <Accordion header="Example header">
      <img
        alt="Vitest logo"
        src="https://www.chromatic.com/integrations/vitest.svg"
      />
    </Accordion>,
  );

  const toggle = page.getByRole("button", { name: "Example header" });
  const image = page.getByRole("image", { name: "Vitest logo" });

  // Open accordion, image should become visible
  await toggle.click();
  await expect.element(image).toBeInTheDocument();

  // Wait for image to finish loading. If it's not ready in 1000ms, error out.
  await waitForIdleNetwork(1_000); // [!code highlight]
  await takeSnapshot("accordion open with image inside");
});
```

Network request state is polled in intervals of `idleNetworkInterval` in milliseconds. Default value is 100ms.
This can be configured on Chromatic plugin's options:

```ts
export default defineConfig({
  plugins: [chromaticPlugin({ idleNetworkInterval: 50 })],
});
```
