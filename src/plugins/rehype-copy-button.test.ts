import { describe, expect, test } from 'vitest';
import { rehype } from 'rehype';
import rehypeCopyButton from './rehype-copy-button';

const process = (html: string) =>
  rehype().data('settings', { fragment: true }).use(rehypeCopyButton).processSync(html).toString();

describe('rehypeCopyButton', () => {
  test('appends a copy button to Shiki code blocks', () => {
    const out = process(
      '<pre class="astro-code github-light" style="color:#24292e"><code><span class="line">npm run dev</span></code></pre>'
    );
    expect(out).toContain('class="copy-code-btn"');
    expect(out).toContain('aria-label="Copy code to clipboard"');
    expect(out).toContain('copy-code-icon-copy');
    expect(out).toContain('copy-code-icon-check');
    // The button is appended inside the pre, after the code child.
    expect(out).toContain('</code><button');
  });

  test('adds exactly one button when run on already-processed output (idempotent)', () => {
    const once = process('<pre class="astro-code"><code>x</code></pre>');
    const twice = process(once);
    expect(twice.match(/class="copy-code-btn"/g)).toHaveLength(1);
  });

  test('leaves inline code and non-Shiki pre blocks untouched', () => {
    const out = process(
      '<p>Run <code>npm run dev</code> first</p><pre><code>plain pre</code></pre>'
    );
    expect(out).not.toContain('copy-code-btn');
  });
});
