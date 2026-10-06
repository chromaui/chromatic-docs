import type { SupportedType } from '../../../chromatic-config/generate-schema';

// Options configurable outside the CLI (config file, CI) show their config key; CLI-only cards stay flag-only.
// Lives in its own module: importing formatOptions here would pull the Node-only markdown
// processor (top-level await in src/markdown.ts) into the client bundle.
export const shouldShowOptionKey = (supports: SupportedType[]): boolean =>
  supports.some((s) => s === 'Config File' || s === 'GitHub Action');
