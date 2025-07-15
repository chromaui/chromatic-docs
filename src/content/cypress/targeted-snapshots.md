---
title: Targeted snapshots
slug: cypress/targeted-snapshots
description: Learn how to capture snapshots at specific points during your Cypress tests programmatically
sidebar: { order: 2 }
---

# Take targeted snapshots with Cypress

By default, Chromatic takes a snapshot at the end of every Cypress test, whether it passes or fails. However, you can also choose to programmatically take snapshots at specific points in your tests using the `takeSnapshot` function inside your test runs.

`takeSnapshot` is especially useful for capturing a snapshot of your UI’s appearance when your UI reaches a specific state mid-test:

```js title="cypress/e2e/Example.cy.js|ts"
describe("My First Test", () => {
  it("Visits the Kitchen Sink", () => {
    // 👇 Navigate to target page
    cy.visit("https://example.cypress.io");

    // 📸 Tell Chromatic to take a snapshot of the initial page state
    cy.takeSnapshot(); // [!code highlight]

    // 👇 Finish the test by opening the dropdown menu
    cy.get(".dropdown:first-of-type > .dropdown-toggle").click();

    // You can call takeSnapshot multiple times if necessary.
    // To help disambiguate, you can give the snapshot a name,
    // which is passed as an argument to cy.takeSnapshot.
    cy.takeSnapshot("After opening dropdown"); // [!code highlight]

    cy.contains("Files").click();

    // 📸 Chromatic automatically takes a snapshot here, at the end of the test.
  });
});
```
