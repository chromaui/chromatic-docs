---
layout: "../../../layouts/FAQLayout.astro"
sidebar: { hide: true }
title: Why do tests show as new in builds?
section: "uiTestsAndReview"
---

# Why do tests show as new in builds?

Tests are identified by their **story name**, which is a combination of key elements in the test file. If any of these elements change, the test will be considered new. Here's a breakdown of how story names are constructed and why they might change:

## Story Name Construction

The story name is generated from:

1. **File Name**: The name of the test file (e.g., `spec.cy.ts`).
2. **Describe Block**: The names of `describe` blocks that organize and group related tests.
3. **It Block**: The name of the specific test within the `it` block.

### Example

Consider the following test file structure:

- **File name**: `spec.cy.ts`
- **Describe block**: `template spec`
- **It block**: `loads homepage`

The story name for this test would be:
`spec.cy.ts > template spec > loads homepage`

## Why a Test Shows as New

If **any** of these elements change—file name, `describe` block name, or `it` block name—the story name changes. As a result, Chromatic interprets the test as new because it no longer matches the previously known story name.

### Examples of Changes:

1. Renaming the file from `spec.cy.ts` to `home.cy.ts`.
2. Updating the `describe` block from `template spec` to `homepage spec`.
3. Modifying the `it` block from `loads homepage` to `renders homepage`.

## How to Avoid Unintentional New Stories

To prevent tests from showing as new unintentionally:

- **Keep naming consistent**: Avoid renaming files, `describe` blocks, or `it` blocks unless necessary.
- **Refactor carefully**: If changes are needed, be aware that the story name will change, and Chromatic will treat it as a new story.
- **Review build diffs**: If a test appears as new, check whether the naming structure has been altered.
