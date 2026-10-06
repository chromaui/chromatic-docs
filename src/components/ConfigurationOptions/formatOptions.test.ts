import { expect, test, describe } from 'vitest';
import { formatOption } from './formatOptions';
import { shouldShowOptionKey } from './shouldShowOptionKey';
import type { ConfigOption, SupportedType } from '../../../chromatic-config/generate-schema';
import configOptions from '../../../chromatic-config/options.json';

const mockOption = {
  option: 'projectToken',
  flag: '--project-token',
  shortFlag: '-t',
  description:
    'The secret token for your project. Prefer to use `CHROMATIC_PROJECT_TOKEN` instead if you can. <br/>Use with `onlyChanged` and `storybookBuildDir` when using a custom [`--config-dir`](https://storybook.js.org/docs/api/cli-options#build) flag for Storybook.',
  type: 'string',
  example: '`"chpt_b2aef0123456789"`',
  supports: ['CLI', 'GitHub Action', 'Config File'],
  deprecated: 'Config File',
} as ConfigOption;

const flatEntries = (configOptions as ConfigOption[]).flatMap((option) =>
  option.options ? [option, ...option.options] : [option]
);

describe('ConfigurationOptions: formatOption', () => {
  test("Sets 'config option' as option", async () => {
    const result = await formatOption(mockOption);
    expect(result.option).toBe('projectToken');
  });

  test("Process 'description' markdown", async () => {
    const result = await formatOption(mockOption);
    expect(result.description).toBe(
      'The secret token for your project. Prefer to use <code>CHROMATIC_PROJECT_TOKEN</code> instead if you can. <br>Use with <code>onlyChanged</code> and <code>storybookBuildDir</code> when using a custom <a href="https://storybook.js.org/docs/api/cli-options#build"><code>--config-dir</code></a> flag for Storybook.'
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
    expect(result.default).toBe('<code>false</code>');
  });

  test("Handles string 'default'", async () => {
    const result = await formatOption({
      ...mockOption,
      default: 'process.cwd()',
    });
    expect(result.default).toBe('<code>process.cwd()</code>');
  });

  test("Uses defaultComment as fallback when no 'default' specified", async () => {
    const result = await formatOption({
      ...mockOption,
      defaultComment: 'Inferred from CI or Git',
    });
    expect(result.default).toBe('Inferred from CI or Git');
  });

  test("Titles the card with the curated 'name'", async () => {
    const result = await formatOption({
      ...mockOption,
      name: 'Project token',
    });
    expect(result.name).toBe('Project token');
  });

  test("Falls back to 'option' when 'name' is absent", async () => {
    const result = await formatOption(mockOption);
    expect(result.name).toBe('projectToken');
  });

  test("Falls back to 'flag' when 'name' and 'option' are absent", async () => {
    const flagOnlyOption: ConfigOption = {
      flag: '--list',
      description: 'Outputs the list of available stories in your Storybook.',
      type: 'boolean',
      example: '`true`',
      supports: ['CLI'],
    };
    const result = await formatOption(flagOnlyOption);
    expect(result.name).toBe('--list');
  });

  test('Marks entries with a real option field as having a config key', async () => {
    const result = await formatOption(mockOption);
    expect(result.hasConfigKey).toBe(true);
  });

  test('Marks flag-only entries as having no config key, keeping the flag substitution', async () => {
    const listOption: ConfigOption = {
      name: 'List available stories',
      flag: '--list',
      description: 'Outputs the list of available stories in your Storybook.',
      type: 'boolean',
      example: '`true`',
      supports: ['CLI'],
    };
    const result = await formatOption(listOption);
    expect(result.hasConfigKey).toBe(false);
    // Anchors and React keys still read the flag-substituted option value.
    expect(result.option).toBe('--list');
    expect(result.anchorId).toBe('list');
  });

  test('Keeps the --patch-build anchor while exposing its config key', async () => {
    const patchBuild = flatEntries.find((option) => option.flag === '--patch-build');
    if (!patchBuild) throw new Error('--patch-build entry missing from options.json');

    const result = await formatOption(patchBuild);
    // The anchor override pins the legacy deep link even though the config key changed.
    expect(result.anchorId).toBe('patch-build');
    expect(result.hasConfigKey).toBe(true);
    expect(result.option).toBe('patchBuild');
  });
});

describe('ConfigurationOptions: shouldShowOptionKey', () => {
  test("Options supported only by 'CLI' hide the option key", () => {
    expect(shouldShowOptionKey(['CLI'] as SupportedType[])).toBe(false);
  });

  test("Options supported by 'Config File' show the option key", () => {
    expect(shouldShowOptionKey(['Config File'] as SupportedType[])).toBe(true);
  });

  test("Options supported by 'GitHub Action' show the option key", () => {
    expect(shouldShowOptionKey(['GitHub Action'] as SupportedType[])).toBe(true);
  });

  test("Options supported by 'CLI', 'GitHub Action' and 'Config File' show the option key", () => {
    expect(shouldShowOptionKey(['CLI', 'GitHub Action', 'Config File'] as SupportedType[])).toBe(
      true
    );
  });

  test('Options with no supports hide the option key', () => {
    expect(shouldShowOptionKey([] as SupportedType[])).toBe(false);
  });
});

describe('ConfigurationOptions: options.json completeness', () => {
  test('every option entry has a non-empty name', () => {
    for (const entry of flatEntries) {
      expect(typeof entry.name).toBe('string');
      expect(entry.name?.trim().length).toBeGreaterThan(0);
    }
  });
});
