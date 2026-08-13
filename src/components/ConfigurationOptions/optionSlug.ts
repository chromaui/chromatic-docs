/**
 * Builds the anchor id for a config option heading.
 *
 * These headings used to be slugged at runtime by AnchorJS. The rules below reproduce its
 * `urlify` output so that links published against the old ids (e.g. `#reactnative-iosbuildcommand`)
 * keep resolving.
 */
export const optionSlug = (option: string | undefined) =>
  (option ?? '')
    .trim()
    .replace(/[^\w-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
