import { describe, expect, test } from 'vitest';
import { articleFromHtml } from './llms-html';

const url = 'https://chromatic.com/docs/example';
function page(body: string): string {
  return `<html><body><nav>Navigation</nav><main>
    <button>Copy Markdown</button>
    <div data-llms-article="example" data-llms-title="Example"
      data-llms-description="An example" data-llms-collection="guides"
      data-llms-discoverable="true">
      <h1>Example</h1>${body}
    </div><footer>Edit page</footer></main></body></html>`;
}

describe('rendered article conversion', () => {
  test('exports article content without page furniture or duplicate title', () => {
    const article = articleFromHtml(
      page(`<p>Substantive content.</p><p data-llms-exclude>Back to FAQs</p>
        <style>.generated{color:red}</style><script>alert('no')</script>
        <h2 id="setup">Setup<a class="autolink-header">Anchor</a></h2>
        <button>Copy</button><span hidden>Search ranking</span>`),
      url
    )!;
    expect(article).toMatchObject({
      id: 'example',
      title: 'Example',
      description: 'An example',
      collection: 'guides',
      discoverable: true,
      url,
    });
    expect(article.body).toBe('Substantive content.\n\n## Setup');
  });

  test('keeps every tab panel, its label, and closed disclosure contents', () => {
    const body = articleFromHtml(
      page(`<div class="not-content"><a role="tab" id="npm">npm</a><a role="tab" id="pnpm">pnpm</a></div>
        <section role="tabpanel" aria-labelledby="npm"><p>npm install chromatic</p></section>
        <section role="tabpanel" aria-labelledby="pnpm" hidden><p>pnpm add chromatic</p></section>
        <details><summary>Help</summary><p>Imported troubleshooting instructions.</p></details>`),
      url
    )!.body;
    expect(body).toContain('npm:\n\nnpm install chromatic');
    expect(body).toContain('pnpm:\n\npnpm add chromatic');
    expect(body).toContain('Help');
    expect(body).toContain('Imported troubleshooting instructions.');
  });

  test('retains an article heading that differs from its metadata title', () => {
    const body = articleFromHtml(
      page('<p>Setup</p>').replace('<h1>Example</h1>', '<h1>Product overview</h1>'),
      url
    )!.body;
    expect(body).toContain('# Product overview');
  });

  test('preserves fenced code language, whitespace, imports, JSX, and blank lines', () => {
    const code =
      'import Component from "./Component";\n\n  const view = &lt;Component /&gt;;\n\n\n  view();';
    const body = articleFromHtml(
      page(`<pre data-language="tsx"><code><span>${code}</span></code><button>Copy</button></pre>`),
      url
    )!.body;
    expect(body).toContain(
      '```tsx\nimport Component from "./Component";\n\n  const view = <Component />;\n\n\n  view();\n```'
    );
  });

  test('exports the resulting code from Shiki diff examples', () => {
    const body = articleFromHtml(
      page(`<pre data-language="ts"><code><span class="line diff remove"><span>import { test, expect } from '@playwright/test';</span></span>
<span class="line diff add"><span>import { test, expect } from '@chromatic-com/playwright';</span></span>
<span class="line highlighted">test('example', async () =&gt; {});</span></code></pre>`),
      url
    )!.body;
    expect(body).not.toContain("from '@playwright/test'");
    expect(body).toContain("from '@chromatic-com/playwright'");
    expect(body).toContain("test('example', async () => {});");
    expect(body.match(/import \{ test, expect \}/g)).toHaveLength(1);
    expect(body).toContain('```ts');
  });

  test('preserves tables, nested lists, image alternatives, and resolves web links', () => {
    const body = articleFromHtml(
      page(`<table><thead><tr><th>Option</th><th>Default</th></tr></thead>
        <tbody><tr><td><code>skip</code></td><td>false</td></tr></tbody></table>
        <ul><li>First<ul><li>Nested</li></ul></li></ul>
        <p><a href="/docs/configure#onlychanged">Options</a> <a href="#setup">Setup</a>
        <a href="../cli">CLI</a> <img src="/docs/assets/example.png" alt="Example UI"></p>
        <video src="/docs/assets/direct.mp4"></video>
        <video><source src="assets/nested.mp4" type="video/mp4"></video>`),
      url
    )!.body;
    expect(body).toMatch(/\| Option\s*\| Default/);
    expect(body).toContain('`skip`');
    expect(body).toContain('- First\n  - Nested');
    expect(body).toContain('[Options](https://chromatic.com/docs/configure#onlychanged)');
    expect(body).toContain('[Setup](https://chromatic.com/docs/example#setup)');
    expect(body).toContain('[CLI](https://chromatic.com/cli)');
    expect(body).toContain('![Example UI](https://chromatic.com/docs/assets/example.png)');
    expect(body).toContain('(https://chromatic.com/docs/assets/direct.mp4)');
    expect(body).toContain('(https://chromatic.com/docs/assets/nested.mp4)');
  });

  test('fails on missing boundaries, incomplete metadata, invalid ids, and empty content', () => {
    expect(() => articleFromHtml('<main><p>Lost boundary</p></main>', url)).toThrow('boundary');
    expect(() => articleFromHtml(page(''), url)).toThrow('Empty');
    expect(() =>
      articleFromHtml(page('<p>Body</p>').replace('data-llms-title="Example"', ''), url)
    ).toThrow('metadata');
    expect(() =>
      articleFromHtml(
        page('<p>Body</p>').replace('data-llms-article="example"', 'data-llms-article="../escape"'),
        url
      )
    ).toThrow('Invalid');
    expect(() =>
      articleFromHtml(`<main>${page('<p>Body</p>')}${page('<p>Body</p>')}</main>`, url)
    ).toThrow('Multiple');
  });

  test('preserves embedded-resource links and fallback text', () => {
    const body = articleFromHtml(
      page('<iframe src="/demo" title="Demo">Fallback instructions</iframe>'),
      url
    )!.body;
    expect(body).toContain('[Demo](https://chromatic.com/demo)');
    expect(body).toContain('Fallback instructions');
  });

  test('fails if conversion drops substantive text from a nonempty article', () => {
    expect(() =>
      articleFromHtml(
        page(
          '<p>Some text remains.</p><select><option>First</option><option>Second</option></select>'
        ),
        url
      )
    ).toThrow('lost article text');
  });

  test('ignores redirects but rejects unmarked HTML pages', () => {
    expect(
      articleFromHtml('<meta http-equiv="refresh" content="0;url=/docs"><main></main>', url)
    ).toBeUndefined();
    expect(() => articleFromHtml('<html><body>Lost boundary</body></html>', url)).toThrow(
      'boundary'
    );
  });
});
