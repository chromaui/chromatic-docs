import { describe, expect, test } from 'vitest';
import { indexMarkdown, type LlmsArticle } from './llms';

const site = 'https://chromatic.com/docs';
const article: LlmsArticle = {
  id: 'example',
  title: 'Example',
  description: 'An example',
  collection: 'overview',
  discoverable: true,
  url: `${site}/example`,
  body: '## Setup\n\n```ts\nimport Component from "./Component";\n\n\n<Component />\n```',
};

describe('LLM index ordering', () => {
  test('keeps section organization stable regardless of article discovery order', () => {
    const docs = [
      { ...article, id: 'faq/example', collection: 'troubleshooting' },
      { ...article, id: 'cms', collection: 'cms' },
      article,
    ];
    const index = indexMarkdown(docs, site);
    expect(index).toContain('## Additional documentation');
    expect(index.indexOf('## Overview')).toBeLessThan(index.indexOf('## Troubleshooting'));
    expect(indexMarkdown([...docs].reverse(), site)).toBe(index);
  });
});
