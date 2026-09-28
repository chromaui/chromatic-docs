import type { Element, ElementContent, Root } from 'hast';
import { h } from 'hastscript';
import { CONTINUE, SKIP, visit } from 'unist-util-visit';

/** SVG icon pair reused from `CopyMarkdown.astro` so both copy UXs stay identical. */
function createIcon(className: string, children: ElementContent[]) {
  return h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 14,
      height: 14,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      className: [className],
      ariaHidden: 'true',
    },
    children
  );
}

function createCopyButton(): Element {
  return h(
    'button',
    { type: 'button', className: ['copy-code-btn'], ariaLabel: 'Copy code to clipboard' },
    createIcon('copy-code-icon-copy', [
      h('rect', { width: 8, height: 4, x: 8, y: 2, rx: 1, ry: 1 }),
      h('path', {
        d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
      }),
    ]),
    createIcon('copy-code-icon-check', [h('path', { d: 'M20 6 9 17l-5-5' })])
  );
}

/** Fenced code blocks arrive here as Shiki output: `pre.astro-code`. */
function hasClass(node: Element, wanted: string): boolean {
  const { className, class: classAttr } = node.properties;
  // Shiki builds its hast output with a non-canonical string `class` property,
  // while parsed/normalized trees use the `className` array — accept both.
  if (Array.isArray(className) && className.includes(wanted)) return true;
  if (typeof className === 'string' && className.split(/\s+/).includes(wanted)) return true;
  return typeof classAttr === 'string' && classAttr.split(/\s+/).includes(wanted);
}

/** Idempotency guard: never add a second button to a `pre` that already has one. */
function hasCopyButton(node: Element): boolean {
  return node.children.some(
    (child) =>
      child.type === 'element' && child.tagName === 'button' && hasClass(child, 'copy-code-btn')
  );
}

/**
 * Append a copy button to every Shiki-highlighted code block (`pre.astro-code`).
 * Register after `rehypeShiki`; the button behavior ships via `CopyCodeButton.astro`.
 */
export default function rehypeCopyButton() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'pre' || !hasClass(node, 'astro-code') || hasCopyButton(node)) {
        return CONTINUE;
      }
      node.children.push(createCopyButton());
      // The button has no `pre` descendants — skip its subtree.
      return SKIP;
    });
  };
}
