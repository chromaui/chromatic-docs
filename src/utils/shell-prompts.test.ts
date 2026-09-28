import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { findShellPromptLines } from './shell-prompts';

const REPO_ROOT = fileURLToPath(new URL('../../', import.meta.url));

function collectMarkdown(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectMarkdown(full, out);
    else if (/\.(md|mdx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

describe('findShellPromptLines', () => {
  test('flags a prompt line in a shell fence', () => {
    const hits = findShellPromptLines({
      path: 'doc.mdx',
      content: ['Intro.', '', '```shell', '$ npm install', '```'].join('\n'),
    });

    expect(hits).toEqual([{ file: 'doc.mdx', line: 4, text: '$ npm install' }]);
  });

  test('flags indented prompt lines', () => {
    const hits = findShellPromptLines({
      path: 'doc.mdx',
      content: ['```shell', '  $ npm install', '    $ yarn install', '```'].join('\n'),
    });

    expect(hits).toEqual([
      { file: 'doc.mdx', line: 2, text: '  $ npm install' },
      { file: 'doc.mdx', line: 3, text: '    $ yarn install' },
    ]);
  });

  test('flags a lone-$ line', () => {
    const hits = findShellPromptLines({
      path: 'doc.mdx',
      content: ['```bash', '$', '```'].join('\n'),
    });

    expect(hits).toEqual([{ file: 'doc.mdx', line: 2, text: '$' }]);
  });

  test('flags prompts in every shell language tag', () => {
    for (const lang of ['shell', 'bash', 'sh']) {
      const hits = findShellPromptLines({
        path: 'doc.mdx',
        content: ['```' + lang, '$ npx chromatic', '```'].join('\n'),
      });

      expect(hits).toHaveLength(1);
    }
  });

  test('does not flag # comment lines inside shell fences', () => {
    const hits = findShellPromptLines({
      path: 'doc.mdx',
      content: ['```shell', '# Build with preview-stats.json', '$ npm run build', '```'].join('\n'),
    });

    expect(hits).toEqual([{ file: 'doc.mdx', line: 3, text: '$ npm run build' }]);
  });

  test('ignores non-shell and untagged fences', () => {
    const hits = findShellPromptLines({
      path: 'doc.mdx',
      content: ['```js', '$ npm install', '```', '', '```', '$ npx chromatic', '```'].join('\n'),
    });

    expect(hits).toEqual([]);
  });

  test('fence metadata does not hide the shell tag', () => {
    const hits = findShellPromptLines({
      path: 'doc.mdx',
      content: ['```shell title="Install"', '$ npm install', '```'].join('\n'),
    });

    expect(hits).toEqual([{ file: 'doc.mdx', line: 2, text: '$ npm install' }]);
  });

  test('does not flag $ without a following space or $ mid-line', () => {
    const hits = findShellPromptLines({
      path: 'doc.mdx',
      content: ['```shell', '$PATH', 'echo $HOME', '```'].join('\n'),
    });

    expect(hits).toEqual([]);
  });
});

describe('repo scan', () => {
  test('no shell prompt lines remain under src/content and src/shared-snippets', () => {
    const files = [
      ...collectMarkdown(join(REPO_ROOT, 'src/content')),
      ...collectMarkdown(join(REPO_ROOT, 'src/shared-snippets')),
    ];

    const hits = files.flatMap((file) =>
      findShellPromptLines({ path: file, content: readFileSync(file, 'utf8') })
    );

    expect(hits).toEqual([]);
  });
});
