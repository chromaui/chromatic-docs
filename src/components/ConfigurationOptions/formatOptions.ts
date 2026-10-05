import type { ConfigOption as ConfigOptionType } from '../../../chromatic-config/generate-schema';
import { markdown } from '../../markdown';

export const formatOption = async (option: ConfigOptionType) => {
  return {
    ...option,
    supports: option.supports,
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
