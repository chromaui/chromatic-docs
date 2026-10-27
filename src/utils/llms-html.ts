import type { Element, Root, RootContent } from 'hast';
import { selectAll } from 'hast-util-select';
import { rehype } from 'rehype';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import type { LlmsArticle } from './llms';

function text(node: Root | RootContent): string {
  if (node.type === 'text') return node.value;
  return 'children' in node ? node.children.map(text).join('') : '';
}

const excludedTags = new Set(['script', 'style', 'svg', 'button', 'noscript', 'template']);
const excludedClasses = new Set(['autolink-header', 'anchorjs-link', 'not-content']);

/** Remove UI furniture, but retain content hidden by tabs and disclosures. */
function clean(parent: Root | Element, url: string, tabs: Map<string, string>): void {
  parent.children = parent.children.flatMap((node): RootContent[] => {
    if (node.type === 'comment') return [];
    if (node.type !== 'element') return [node];
    const props = node.properties;
    const classes = Array.isArray(props.className) ? props.className.map(String) : [];
    const isPanel = props.role === 'tabpanel';
    if (
      excludedTags.has(node.tagName) ||
      'dataLlmsExclude' in props ||
      classes.some((name) => excludedClasses.has(name)) ||
      // Export the resulting code, excluding lines marked for removal by Shiki.
      (classes.includes('line') && classes.includes('diff') && classes.includes('remove')) ||
      props.role === 'tablist' ||
      (props.hidden && !isPanel)
    ) {
      return [];
    }

    // All tab variants belong in the export, including initially hidden panels.
    delete props.hidden;
    if (isPanel) {
      const label = tabs.get(String(props.ariaLabelledBy ?? ''));
      if (label) {
        node.children.unshift({
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [{ type: 'text', value: `${label}:` }],
        });
      }
    }

    if (node.tagName === 'a' && typeof props.href === 'string') {
      props.href = new URL(props.href, url).href;
    }
    if (['img', 'video', 'source'].includes(node.tagName) && typeof props.src === 'string') {
      props.src = new URL(props.src, url).href;
    }
    // Embeds have no Markdown equivalent. Keep their fallback text and a link
    // to the embedded resource rather than silently dropping the whole node.
    if (node.tagName === 'iframe') {
      node.tagName = 'div';
      if (typeof props.src === 'string') {
        node.children.unshift({
          type: 'element',
          tagName: 'a',
          properties: { href: new URL(props.src, url).href },
          children: [{ type: 'text', value: String(props.title || 'Embedded content') }],
        });
      }
    }

    // Shiki puts the language on <pre>; the converter reads it on <code>.
    if (node.tagName === 'pre' && typeof props.dataLanguage === 'string') {
      const code = node.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code'
      );
      if (code) code.properties.className = [`language-${props.dataLanguage}`];
    }
    clean(node, url, tabs);
    return [node];
  }) as Element['children'];
}

/** Extract one explicitly marked article from a completed HTML page. */
export function articleFromHtml(html: string, url: string): LlmsArticle | undefined {
  const tree = rehype().parse(html);
  const articles = selectAll('[data-llms-article]', tree);
  if (articles.length === 0) {
    if (selectAll('meta[http-equiv="refresh"]', tree).length) return undefined;
    throw new Error(`Missing LLM article boundary: ${url}`);
  }
  if (articles.length !== 1) throw new Error(`Multiple LLM articles: ${url}`);
  const article = articles[0];
  const props = article.properties;
  const id = String(props.dataLlmsArticle ?? '');
  const title = String(props.dataLlmsTitle ?? '');
  const collection = String(props.dataLlmsCollection ?? '');
  if (
    !id ||
    !title ||
    !collection ||
    !['true', 'false'].includes(String(props.dataLlmsDiscoverable))
  ) {
    throw new Error(`Incomplete LLM article metadata: ${url}`);
  }
  if (id.split('/').some((part) => !part || part === '.' || part === '..') || /[\\?#]/.test(id)) {
    throw new Error(`Invalid LLM article id: ${id}`);
  }
  const tabs = new Map(
    selectAll('[role="tab"]', article).map((tab) => [String(tab.properties.id), text(tab)])
  );
  clean(article, url, tabs);

  // The serializer supplies the article title once. Some pages use a different
  // content heading (e.g. Quickstart's "Chromatic for Storybook"); retain it.
  const firstHeading = selectAll('h1', article)[0];
  if (firstHeading && text(firstHeading).trim() === title.trim()) {
    firstHeading.tagName = 'div';
    firstHeading.children = [];
  }

  const root: Root = { type: 'root', children: article.children };
  const expectedText = htmlValues(root);
  const processor = rehype()
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify, { fences: true, bullet: '-', listItemIndent: 'one' });
  const markdownTree = processor.runSync(root);
  // Check the conversion itself, rather than relying only on a few known
  // articles staying nonempty. Losing a snippet or generated definition must
  // fail the build even when the rest of its article still exports correctly.
  const compact = (value: string) => value.normalize('NFKC').replace(/\s/g, '');
  const markdownText = compact(markdownValues(markdownTree).join(''));
  for (const value of expectedText) {
    if (!markdownText.includes(compact(value))) {
      throw new Error(`LLM conversion lost article text in ${url}: ${value.slice(0, 80)}`);
    }
  }
  const body = processor.stringify(markdownTree).trim();
  if (!body) throw new Error(`Empty LLM article: ${url}`);
  return {
    id,
    title,
    description: String(props.dataLlmsDescription || title),
    collection,
    discoverable: props.dataLlmsDiscoverable === 'true',
    url,
    body,
  };
}

function htmlValues(node: Root | RootContent): string[] {
  if (node.type === 'text') return [node.value];
  if (node.type === 'element' && node.tagName === 'img') return [String(node.properties.alt ?? '')];
  return 'children' in node ? node.children.flatMap(htmlValues) : [];
}

// Only semantic text: URLs and Markdown syntax do not count as preserved prose.
function markdownValues(node: {
  type: string;
  value?: string;
  alt?: string | null;
  children?: Parameters<typeof markdownValues>[0][];
}): string[] {
  if (node.type === 'image') return [node.alt ?? ''];
  if (node.value !== undefined) return [node.value];
  return node.children?.flatMap(markdownValues) ?? [];
}
