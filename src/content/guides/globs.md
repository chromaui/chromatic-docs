---
title: Globs
description: Learn how to use glob patterns with the Chromatic`, including examples of how to exclude specific files or directories from testing.
sidebar: { order: 10 }
---

# Globs

Chromatic options like `onlyStoryFiles` and `externals` allow you to include or exclude specific files or directories. You can specify a single file, a list using an array or by passing the CLI flag multiple times. Additionally, you can use wildcard characters known as [glob patterns](https://code.visualstudio.com/docs/editor/glob-patterns) to define sets of files or directories.

Chromatic handles globs using [picomatch](https://www.npmjs.com/package/picomatch). For a complete overview of the syntax, refer to the [picomatch documentation](https://github.com/micromatch/picomatch?tab=readme-ov-file#globbing-features).

## How to verify your glob pattern

[Picomatch playground](https://picomatch-playground-ebjlxm.csb.app/) is a handy tool for testing your glob patterns. Let's look at some examples to understand how to use globs with Chromatic.

Imagine we have a project with the following list of files. Copy and paste it into the `File structure` text box of the [Picomatch playground](https://picomatch-playground-ebjlxm.csb.app/).

```
.stories/preview.jsx
.stories/config/backgrounds.ts
.stories/config/msw-default-handlers.ts
.stories/decorators/auth-wrapper.tsx
.stories/decorators/redux-wrapper.tsx
src/core/show-metrics/toggle-show-metrics-banner.tsx
.stories/decorators/language-wrapper.tsx
src/core/pdf-preview/pdf-preview-test-story.tsx
src/i18n.js
src/core/api/program-api/program-api-fixtures.ts
.stories/config/msw-handlers/msw-sales-workflow-preferences-api.ts
.stories/config/msw-handlers/msw-organization-handlers.ts
.stories/config/msw-handlers/msw-validate-credit-token-api-handlers.ts
.stories/config/msw-handlers/msw-credit-application-api-handlers.ts
.stories/config/msw-handlers/msw-document-api-handlers.ts
.stories/config/msw-handlers/msw-features-handlers.ts
.stories/config/msw-handlers/msw-live-proposal-api-handlers.ts
.stories/config/msw-handlers/msw-utility-api-handlers.ts
.stories/config/msw-handlers/msw-site-api.handlers.ts
.stories/config/msw-handlers/msw-metrics-handlers.ts
.stories/config/msw-handlers/msw-quote-api-handlers.ts
src/core/api/assignment-api/assignment-fixtures.ts
.stories/config/msw-handlers/msw-contact-api.ts
.stories/config/msw-handlers/msw-address-api-handlers.ts
.stories/config/msw-handlers/msw-product-handlers.ts
.stories/config/msw-handlers/msw-quote-template-api-handlers.ts
.stories/config/msw-handlers/msw-design-desk-template-api-handlers.ts
.stories/config/msw-handlers/msw-deal-tracker-dashboard-api-handlers.ts
.stories/config/msw-handlers/msw-report-definition-api-handlers.ts
src/core/show-metrics/toggle-show-metrics-banner.styl
src/translations/proposal/en.ts
src/translations/credit-application/en.ts
src/translations/proposal/es.ts
src/translations/credit-application/es.ts
src/translations/project/en.ts
src/translations/project/es.ts
src/core/api/organization-testimonial-api/organization-testimonial-api-fixtures.ts
public/test-files/test-pdf.pdf
public/test-files/test-pdf-spanish.pdf
src/core/api/features/features-api-fixtures.ts
src/core/api/utility-api/utility-api-fixtures.ts
src/core/edit-usage/edit-usage-table-fixtures.ts
src/components/settings/settings-quote/quote-templates/quote-templates-react/quote-templates-fixtures.ts
src/core/api/design-desk-template-api/design-desk-template-api-fixtures/design-desk-template-detail-fixture.ts
src/core/api/report-definition-api/report-definition-api-fixtures.ts
```

Below are different scenarios that demonstrate how to use globs to include or exclude files or directories. Try copying and pasting the examples into the `Glob string` text box of the playground to see the results.

### Scenario 1: Exclude all files in the `.stories` directory

```
.stories/**
```

### Scenario 2: Exclude all TypeScript files and TypeScript files with React components

```
**/*.ts|**/*.tsx|**/*.js.  # Use | to divide
```

### Scenario 3: Exclude specific MSW handlers

```
.stories/config/msw-handlers/**
```

### Scenario 4: Exclude translation files

```
src/translations/**
```

### Scenario 5: Exclude everything but a specific file

```
!(.stories/config/msw-handlers/msw-quote-api-handlers.ts)
```
