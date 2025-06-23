---
layout: "../../layouts/Layout.astro"
title: Dashboard
description: Monitor accessibility compliance across your application with Chromatic's dashboard
slug: accessibility/dashboard
sidebar: { order: 4 }
---

# Accessibility dashboard

The Accessibility dashboard offers a comprehensive overview of accessibility issues in your components. Chromatic continuously monitors accessibility violations, enabling you to track compliance trends and prioritize remediation efforts effectively.

![Chromatic Accessibility dashboard showing 37,402 violations across 127 components and 263 total tests. The main chart displays violation trends from January to June. Below it is a table listing components by violation count.](../../images/a11y/accessibility-dashboard.png)

## Real-time tracking and historical insights

Chromatic samples accessibility violations daily and reports on key metrics including total violations, components tested, and total test count. The trend visualization shows how your project's accessibility compliance evolves over time, helping you measure the impact of remediation efforts and identify patterns in violation occurrences.

## Component-level analysis

The data table ranks components by violation count in descending order, immediately highlighting areas requiring urgent attention. Each component displays its violation count with severity classification and last update timestamp. This systematic approach enables teams to address accessibility debt by focusing resources on components with the highest user impact first.

## Export reports

Download a CSV file containing all accessibility violations, associated components, and story details. This report streamlines compliance documentation and supports regulatory requirements such as Voluntary Product Accessibility Template (VPAT) submissions.

## Branch-specific monitoring

The dashboard dynamically updates to reflect accessibility data for your currently selected branch. You can configure your default branch from the manage page of your project.

![Manage page for a project with the "Configure Tab" selected. The default branch configuration is in the project section.](../../images/a11y/default-branch.png)

## Plan-based limits

Chromatic provides **seven days of data history** with access limited to the default branch (typically `main`). Enterprise plans with the accessibility package enabled offer full historical data with multi-branch accessibility tracking.
