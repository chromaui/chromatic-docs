---
layout: default
title: Building and uploading
description: Learn about the build and upload process for Chromatic
---

# Building and uploading

We've changed the way that we build your Storybook and upload builds over time.

## Tunnel method

The original version of [**storybook-chromatic**](https://www.npmjs.com/package/storybook-chromatic) (now deprecated, use the [**chromatic**](https://www.npmjs.com/package/chromatic) package instead) used a tunnelling mechanism in order to capture screenshots of your stories and create a hosted version of your storybook. The CLI package would create a HTTPS tunnel between your CI server (running Storybook in development mode) and our capture cloud.

This technique works well generally, however it relies on a stable network connection between your CI server and our tunnel's server for the lifetime of your build. In some cases, this connection could be less than perfect for reasons outside of both your and our control, and could lead to miscaptured stories when resources failed to load.

## Build and upload method

As of `storybook-chromatic@2.0.0` we have been defaulting to building (using `build-storybook` ) and uploading Storybooks to our servers, before starting the capture process.

We've found that this is a much more predictable, reliable, and often faster process for creating builds. Additionally, it even means as of `storybook-chromatic@3.4.0` you can pass the `--exit-once-uploaded` flag and not have to keep your CI server running while Chromatic does its capturing!

We'll continue to support the tunnel for the foreseeable future, however it is now officially deprecated and we urge you to switch to uploaded builds.

To start using uploaded builds, simply ensure you are on the latest version of [**chromatic**](https://www.npmjs.com/package/chromatic) and that you are not using the `-s` / `--script-name` flag in your "chromatic" script. If you use a custom Npm script name to build your Storybook, you'll need to pass the `-b` / `--build-script-name` flag to the Chromatic CLI.
