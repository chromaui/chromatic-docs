import { expect, test, describe } from "vitest";
import { formatOption } from "./ConfigurationOptions.astro";
import type { ConfigOption } from "../../chromatic-config/generate-schema";

const mockOption = {
  option: "projectToken",
  flag: "--project-token",
  shortFlag: "-t",
  description:
    "The secret token for your project. Prefer to use `CHROMATIC_PROJECT_TOKEN` instead if you can. <br/>Use with `onlyChanged` and `storybookBuildDir` when using a custom [`--config-dir`](https://storybook.js.org/docs/api/cli-options#build) flag for Storybook.",
  type: "string",
  example: '`"chpt_b2aef0123456789"`',
  supports: ["CLI", "CI", "config.json"],
  deprecated: "config.json",
} as ConfigOption;

describe("ConfigurationOptions: formatOption", () => {
  test("Sets 'config option' as option", async () => {
    const result = await formatOption(mockOption);
    expect(result.option).toBe("projectToken");
  });

  test("Process 'description' markdown", async () => {
    const result = await formatOption(mockOption);
    expect(result.description).toBe(
      'The secret token for your project. Prefer to use <code>CHROMATIC_PROJECT_TOKEN</code> instead if you can. <br>Use with <code>onlyChanged</code> and <code>storybookBuildDir</code> when using a custom <a href="https://storybook.js.org/docs/api/cli-options#build"><code>--config-dir</code></a> flag for Storybook.',
    );
  });

  test("Process 'example' markdown", async () => {
    const result = await formatOption(mockOption);
    expect(result.example).toBe('<code>"chpt_b2aef0123456789"</code>');
  });

  test("Handles boolean 'default'", async () => {
    const result = await formatOption({
      ...mockOption,
      default: false,
    });
    expect(result.default).toBe("<code>false</code>");
  });

  test("Handles string 'default'", async () => {
    const result = await formatOption({
      ...mockOption,
      default: "process.cwd()",
    });
    expect(result.default).toBe("<code>process.cwd()</code>");
  });

  test("Uses defaultComment as fallback when no 'default' specified", async () => {
    const result = await formatOption({
      ...mockOption,
      defaultComment: "Inferred from CI or Git",
    });
    expect(result.default).toBe("Inferred from CI or Git");
  });
});
