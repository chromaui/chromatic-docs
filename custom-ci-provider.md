---
layout: default
title: Automate Chromatic with your custom CI provider
description: Learn how to configure Chromatic with a custom provider
---


# Automate Chromatic with a custom provider

Chromatic supports a wide variety of CI providers. If the one you're using is not documented and you want begin your integration process, you can start by including the following into your workflow:

```yml
# your-workflow

- run:
    command: npm install # install dependencies
- run:
    command: npm test # run your unit tests
- run:
    command: npm run chromatic --project-token=CHROMATIC_PROJECT_TOKEN # 👈 publish Storybook and run visual tests
```

Reach us in-app chat for assistance