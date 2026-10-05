import type { ConfigOption as ConfigOptionType } from '../../../chromatic-config/generate-schema';
import { markdown } from '../../markdown';

export const formatOption = async (option: ConfigOptionType) => {
  return {
    ...option,
    supports: option.supports,
    // True only when the raw entry carries a real config key. Flag-only entries
    // (--list, --patch-build) get the flag substituted into `option` below for
    // anchors and keys, and must not render that flag as a config key.
    hasConfigKey: option.option !== undefined,
    // Card title: curated name, else the option key, else the flag. `option` stays the anchor + React key source.
    name: option.name ?? option.option ?? option.flag,
    option: option.option || option.flag,
    description: await markdown(option.description),
    example: await markdown(option.example),
    default:
      option.default !== undefined
        ? `<code>${option.default}</code>`
        : await markdown(option.defaultComment || ''),
  };
};
