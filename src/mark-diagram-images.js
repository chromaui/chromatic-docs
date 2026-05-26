import { visit } from 'unist-util-visit';

export function markDiagramImages() {
  return function (tree) {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
      const src = node.properties?.src;
      if (typeof src === 'string' && src.includes('/diagrams/')) {
        const existing = node.properties.className ?? [];
        node.properties.className = Array.isArray(existing)
          ? [...existing, 'diagram']
          : [existing, 'diagram'];
      }
    });
  };
}
