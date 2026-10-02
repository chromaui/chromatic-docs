import type { Element, Root } from 'hast';
import { CONTINUE, visit } from 'unist-util-visit';

export const ZOOMABLE_CLASS = 'zoomable';

/** Animated formats stay inline: a lightbox adds nothing for them. */
const ANIMATED_EXTENSIONS = /\.(gif|apng)$/i;

function isAnimated(src: unknown): boolean {
  if (typeof src !== 'string') return false;
  const path = src.split(/[?#]/)[0];
  return ANIMATED_EXTENSIONS.test(path);
}

function addClass(node: Element, name: string) {
  const existing = node.properties.className;
  const list = Array.isArray(existing)
    ? existing
    : typeof existing === 'string'
      ? existing.split(/\s+/).filter(Boolean)
      : [];
  if (!list.includes(name)) node.properties.className = [...list, name];
}

/**
 * Mark Markdown content images as zoomable so `ImageLightbox.astro` can open
 * them in a lightbox. Register before `rehypeRaw` so only Markdown-syntax
 * images (`![alt](src)`) are affected — hand-written HTML `<img>` tags are
 * usually icons and logos. Linked images keep their link behavior.
 */
export default function rehypeZoomableImages() {
  return (tree: Root) => {
    visit(tree, 'element', (node, _index, parent) => {
      if (node.tagName !== 'img') return CONTINUE;
      if (parent?.type === 'element' && parent.tagName === 'a') return CONTINUE;
      if (isAnimated(node.properties.src)) return CONTINUE;
      addClass(node, ZOOMABLE_CLASS);
      return CONTINUE;
    });
  };
}
