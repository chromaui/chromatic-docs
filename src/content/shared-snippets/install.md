<details>
<summary>Learn how to add <code>chromatic</code> to your package.json</summary>

The `chromatic` command will also give you the option of adding an npm script to your `package.json` so you can run future builds with `npm run chromatic/yarn chromatic`. If you want to add it manually, it should look something like:

```json
{
  "scripts": {
    "chromatic": "chromatic"
  }
}
```

The above script command will pick up your project token by reading the `CHROMATIC_PROJECT_TOKEN` environment variable. After adding the above, ensure you set `CHROMATIC_PROJECT_TOKEN` when you run builds - such as in your CI config.

If you allowed `chromatic` to add the above line, it will also have written the environment variable to your `package.json`. This environment variable can also be set via your CI config for extra privacy.

</details>

<details>
<summary>Setup .gitignore to ignore certain files in your Git repository</summary>

Running the Chromatic command may generate certain files for logging and debugging purposes. Exactly which files it generates depends on your configuration, but these entries should likely be added to your `.gitignore` file:

```
build-storybook.log
chromatic.log
chromatic-build-*.xml
chromatic-diagnostics.json
```

</details>
