---
title: Configure
slug: cypress/configure
description: Learn about the various configuration options for visual tests for Cypress
sidebar: { order: 3 }
---

# Configure visual tests for Cypress

You can enhance your Cypress and Chromatic tests further by configuring them using the options outlined in the following sections.

## Cypress options

Cypress can be configured with [Cypress environment variables](https://docs.cypress.io/guides/guides/environment-variables). You can set the available options globally in your Cypress configuration file as follows:

```ts title="cypress.config.js|ts"
export default defineConfig({
  env: {
    // 👇 Sets the option at the project level.
    disableAutoSnapshot: true,
  },
  // Other project configuration options
});
```

You can also override them for specific tests using via the [`env`](https://docs.cypress.io/guides/guides/environment-variables#Suite-of-test-configuration) option in the test configuration:

```ts title="cypress/e2e/HomePage.cy.js|ts"
describe("HomePage", () => {
  it(
    "Loads the page with auto snapshotting disabled",
    {
      env: {
        // 👇 Overrides the option in the test.
        disableAutoSnapshot: true,
      },
    },
    () => {
      cy.visit("/");
    },
  );
});
```

### E2E options

These options control how the Chromatic archive fixture behaves.

| Option                   | Type            | Description                                                                                                                                                                          |
| ------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `disableAutoSnapshot`    | `boolean`       | When `true`, it will disable the snapshot that happens automatically at the end of a test when using the Chromatic test fixture.                                                     |
| `resourceArchiveTimeout` | `number`        | Maximum amount of time each test will wait for the network to be idle while archiving resources.                                                                                     |
| `assetDomains`           | `array[string]` | A list of domains external to the test location that you want Chromatic to also capture assets from, e.g., <code style="display: inline;">['other-domain.com','our-cdn.com']</code>. |

### Chromatic options

These options control how Chromatic behaves when capturing snapshots of your pages.

| Option                    | Type            | Chromatic Docs                                                                      |
| ------------------------- | --------------- | ----------------------------------------------------------------------------------- |
| `delay`                   | `number`        | [Delay](/docs/delay/)                                                               |
| `diffIncludeAntiAliasing` | `boolean`       | [Threshold for changes](/docs/threshold#anti-aliasing)                              |
| `diffThreshold`           | `number`        | [Threshold for changes](/docs/threshold#setting-the-threshold)                      |
| `ignoreSelectors`         | `array[string]` | [Ignore elements](/docs/ignoring-elements#ignoring-elements-via-test-configuration) |
| `forcedColors`            | `string`        | [Media Features](/docs/media-features#test-high-contrast-color-schemes)             |
| `pauseAnimationAtEnd`     | `boolean`       | [Animations](/docs/animations#css-animations)                                       |
| `prefersReducedMotion`    | `string`        | [Media Features](/docs/media-features#verify-reduced-motion-animations)             |

### Environment variables

Some options can be configured through environment variables.

| Environment variable         | Description                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CHROMATIC_ARCHIVE_LOCATION` | If you have configured your project's [`downloadsFolder`](https://docs.cypress.io/guides/references/configuration#Downloads) option to be different than the default, you must set the `CHROMATIC_ARCHIVE_LOCATION` environment variable to the same value. This ensures that the Chromatic can find the archives generated by Cypress tests. |
