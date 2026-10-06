import type { ConfigOption as ConfigOptionType } from '../../../chromatic-config/generate-schema';
import { markdown } from '../../markdown';
import { optionSlug } from './optionSlug';

export const formatOption = async (option: ConfigOptionType) => {
  return {
    ...option,
    supports: option.supports,
    // True only when the raw entry carries a real config key. Flag-only entries
    // (--list) get the flag substituted into `option` below for React keys,
    // and must not render that flag as a config key.
    hasConfigKey: option.option !== undefined,
    // Effective anchor source: an explicit metadata override, else the config
    // key, else the flag. optionSlug must see the original key shape so
    // anchors never drift when `option` is re-keyed.
    anchorId: optionSlug(option.anchor || option.option || option.flag),
    // Card title: curated name, else the option key, else the flag. `option` stays the React key source.
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
