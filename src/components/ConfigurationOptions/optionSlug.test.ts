import { expect, test, describe } from 'vitest';
import { optionSlug } from './optionSlug';
import configOptions from '../../../chromatic-config/options.json';
import type { ConfigOption } from '../../../chromatic-config/generate-schema';

describe('ConfigurationOptions: optionSlug', () => {
  test('lowercases camelCase option names', () => {
    expect(optionSlug('onlyStoryNames')).toBe('onlystorynames');
  });

  test('replaces the separator in nested option names with a dash', () => {
    expect(optionSlug('reactNative.iosBuildCommand')).toBe('reactnative-iosbuildcommand');
  });

  test('strips the leading dashes of CLI-only flags', () => {
    expect(optionSlug('--patch-build')).toBe('patch-build');
    expect(optionSlug('--list')).toBe('list');
  });

  test('produces a unique anchor for every documented option', () => {
    const names = (configOptions as ConfigOption[]).flatMap((option) =>
      option.options && option.options.length > 0
        ? option.options.map((subOption) => `${option.option}.${subOption.option}`)
        : [option.option || option.flag]
    );
    const slugs = names.map((name) => optionSlug(name));

    expect(slugs).not.toContain('');
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
