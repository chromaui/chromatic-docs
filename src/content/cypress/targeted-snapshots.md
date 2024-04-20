---
layout: "../../layouts/Layout.astro"
title: Targeted snapshots
slug: cypress/targeted-snapshots
description: Learn how to programmatically capture snapshots at specific points during your Cypress tests
sidebar: { order: 2 }
---

# Take targeted snapshots with Cypress

By default, Chromatic takes a snapshot at the end of every Cypress test, whether is passes or fails. But you can also chose to programmatically take snapshots at specific points in your tests using the `takeSnapshot` function inside your test runs.

This is especially useful for getting the app UI into a desired state mid-test and capturing its appearance before taking one final snapshot at the end.

```js
describe("My First Test", () => {
  it("Visits the Kitchen Sink", () => {
    // 👇 navigate to target page
    cy.visit("https://example.cypress.io");

    // 📸 tell Chromatic to take a snapshot of the initial page state
    cy.takeSnapshot();

    // 👇 finish the test by opening the dropdown menu
    cy.get(".dropdown:first-of-type > .dropdown-toggle").click();

    // 📸 Chromatic automatically takes a snapshot here, at the end of the test
  });
});
```
