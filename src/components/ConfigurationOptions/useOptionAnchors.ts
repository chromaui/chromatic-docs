import { useEffect } from 'react';

declare global {
  interface Window {
    anchors?: { add: (selector: string) => void };
  }
}

/**
 * Adds AnchorJS hover links to the option headings.
 *
 * The global `anchors.add()` in `Scripts.astro` runs once on load, which leaves any option that
 * mounts later — when the platform filter changes — without a link. Re-running it whenever the
 * rendered set changes covers those. AnchorJS skips headings that already have a link and reuses
 * an existing `id`, so repeat calls neither duplicate links nor rewrite the server-rendered slugs.
 */
export const useOptionAnchors = (renderedOptions: unknown[]) => {
  useEffect(() => {
    window.anchors?.add('.config-option');
  }, [renderedOptions]);
};
