---
layout: "../../layouts/Layout.astro"
title: Mocking APIs and Network Requests
description: Learn how to mock APIs and network requests in your tests (Storybook, Playwright and Cypress)
sidebar: { order: 5, label: "Mocking APIs" }
---

# Mocking APIs and Network Requests

When testing components or pages that make network requests, it's important to mock those requests to keep your tests isolated and predictable. Chromatic integrates with functional testing frameworks to enable visual testing of your UI. Therefore, APIs are mocked by your functional testing framework, not by Chromatic itself.

## Storybook

Storybook offers [several addons](https://storybook.js.org/addons/tag/api) for mocking APIs (e.g. fetching data from a REST or GraphQL API). We recommend using the [MSW addon](https://storybook.js.org/addons/msw-storybook-addon). Mock Service Worker (MSW) is an API mocking library that uses service workers to capture network requests and provide mocked data in response. The MSW addon integrates this functionality into Storybook. Here’s a basic example:

```tsx title="DocumentScreen.stories.tsx"
// Replace your-framework with the name of your framework (e.g. nextjs, vue3-vite)
import type { Meta, StoryObj } from "@storybook/your-framework";

import { http, HttpResponse, delay } from "msw";

import { DocumentScreen } from "./DocumentScreen";

const meta = {
  component: DocumentScreen,
} satisfies Meta<typeof DocumentScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

// 👇 The mocked data that will be used in the story
const mockDocuments = [
  {
    id: 1,
    userID: 1,
    title: "Something",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "approved",
  },
  {
    id: 2,
    userID: 1,
    title: "Something else",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "pending",
  },
  {
    id: 3,
    userID: 2,
    title: "Another thing",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "rejected",
  },
];

export const MockedSuccess: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/documents", () => {
          return HttpResponse.json(mockDocuments);
        }),
      ],
    },
  },
};

export const MockedError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/documents", async () => {
          await delay(800);
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};
```

For more details, check out the [Mocking network requests](https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-network-requests) page in the Storybook documentation.

## Playwright

Playwright allows you to mock network requests, including XHRs and fetch requests. You can also use HAR files to mock multiple network requests made by the page. Check out the [Playwright documentation](https://playwright.dev/docs/mock#mock-api-requests) for more details.

```js title="tests/DocumentScreen.spec.js|ts"
test("mocks documents api", async ({ page }) => {
  // Mock the api call before navigating
  await page.route("*/**/api/documents", async (route) => {
    const json = [
      {
        id: 1,
        userID: 1,
        title: "Something",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        status: "approved",
      },
      {
        id: 2,
        userID: 1,
        title: "Something else",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        status: "pending",
      },
      {
        id: 3,
        userID: 2,
        title: "Another thing",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        status: "rejected",
      },
    ];
    await route.fulfill({ json });
  });
  // Go to the page
  await page.goto("https://myapp.com/documents");

  // Assert that the "Something else" is visible
  await expect(page.getByText("Something else")).toBeVisible();
});
```

## Cypress

Cypress allows you to stub API responses with the `cy.intercept()` method, letting you define the body, HTTP status code, headers, and other response characteristics. You can also use `cy.fixture()` to load mock data from a file. For more details, check out the [Cypress documentation](https://docs.cypress.io/guides/guides/network-requests#Stubbing).

```js title="cypress/e2e/DocumentScreen.cy.js|ts"
cy.intercept(
  {
    method: "GET", // Route all GET requests
    url: "/api/documents",
  },
  [
    {
      id: 1,
      userID: 1,
      title: "Something",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "approved",
    },
    {
      id: 2,
      userID: 1,
      title: "Something else",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "pending",
    },
    {
      id: 3,
      userID: 2,
      title: "Another thing",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "rejected",
    },
  ], // and force the response to be mock data
).as("getDocuments"); // and assign an alias
```
