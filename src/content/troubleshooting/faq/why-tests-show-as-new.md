---
sidebar: { hide: true }
title: Why do tests show as new in builds?
section: "uiTestsAndReview"
---

# Why do tests show as new in builds?

Tests are identified by their **test name**, which is a combination of key elements in the test file. If any of these elements change, the test will be considered new. Here's a breakdown of how test names are constructed and why they might change.

## Test Name Construction

The test name is generated from:

1. **File Name**: The name of the test file (e.g., `spec.cy.ts`).
2. **Describe Block**: The names of `describe` blocks that organize and group related tests.
3. **It Block**: The name of the specific test within the `it` block.

If **any** of these elements change—file name, `describe` block name, or `it` block name—the test name changes. As a result, Chromatic interprets the test as new because it no longer matches the previously known test name.

### Example

Consider the following test file structure:

- **File name**: `spec.cy.ts`
- **Describe block**: `template spec`
- **It block**: `loads homepage`

The name for this test would be:
`spec/template spec/loads homepage`

## How to Avoid Unintentional New Tests

To prevent tests from showing as new unintentionally:

- **Keep naming consistent**: Avoid renaming files, `describe` blocks, or `it` blocks unless necessary.
- **Refactor carefully**: If changes are needed, be aware that the test name will change, and Chromatic will treat it as new.
- **Review build diffs**: If a test appears as new, check whether the naming structure has been altered.
