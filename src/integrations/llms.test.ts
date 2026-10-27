import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, test } from 'vitest';
import { exportLlms } from './llms';

const dirs: string[] = [];
afterEach(async () => {
  await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

function page(id: string, collection = 'overview', discoverable = true): string {
  return `<main><div data-llms-article="${id}" data-llms-title="Title for ${id}"
    data-llms-description="Description" data-llms-collection="${collection}"
    data-llms-discoverable="${discoverable}"><h1>Title for ${id}</h1><p>Content for ${id}.</p></div></main>`;
}

async function fixture(files: Record<string, string>): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'docs-llms-'));
  dirs.push(dir);
  for (const [path, content] of Object.entries(files)) {
    await mkdir(join(dir, path, '..'), { recursive: true });
    await writeFile(join(dir, path), content);
  }
  return dir;
}

test('exports all article routes, preserves root alias, and keeps hidden pages direct-only', async () => {
  const dir = await fixture({
    'index.html': page('introduction'),
    'faq/index.html': page('faq', 'troubleshooting'),
    'faq/answer/index.html': page('faq/answer', 'troubleshooting'),
    'api/index.html': page('api', 'notInNavigation', false),
    'cms.html': page('cms', 'cms'),
    '404.html': '<main>Error</main>',
    'old/index.html': '<meta http-equiv="refresh" content="0;url=/docs">',
  });
  const site = 'https://chromatic.com/docs';
  const articles = await exportLlms(dir, site);
  expect(articles).toHaveLength(5);
  expect(await readFile(join(dir, 'llms/introduction.txt'), 'utf8')).toContain(`URL: ${site}\n`);
  expect(await readFile(join(dir, 'llms/faq/answer.txt'), 'utf8')).toContain(
    'Content for faq/answer.'
  );
  expect(await readFile(join(dir, 'llms/api.txt'), 'utf8')).toContain('Content for api.');
  const index = await readFile(join(dir, 'llms.txt'), 'utf8');
  const full = await readFile(join(dir, 'llms-full.txt'), 'utf8');
  expect(index).toContain(`${site}/llms-full.txt`);
  expect(index).toContain(`${site}/llms/faq/answer.txt`);
  expect(index).toContain(`${site}/llms/cms.txt`);
  expect(index).not.toContain('/llms/api.txt');
  expect(full).not.toContain('Content for api.');
  expect(full).toContain(
    `## Title for introduction\n\nURL: ${site}\n\n> Description\n\nContent for introduction.\n\n---`
  );
  expect(full.match(/^URL: /gm)).toHaveLength(4);

  await rm(join(dir, 'faq/answer'), { recursive: true });
  await writeFile(
    join(dir, 'index.html'),
    page('introduction').replace('Content for', 'Updated content for')
  );
  await exportLlms(dir, site);
  expect(await readFile(join(dir, 'llms/introduction.txt'), 'utf8')).toContain(
    'Updated content for'
  );
  await expect(readFile(join(dir, 'llms/faq/answer.txt'))).rejects.toThrow();
  expect(await readFile(join(dir, 'llms-full.txt'), 'utf8')).not.toContain(
    'Content for faq/answer.'
  );
});

test('fails the build when different pages export the same article id', async () => {
  const duplicate = await fixture({ 'index.html': page('same'), 'other.html': page('same') });
  await expect(exportLlms(duplicate, 'https://chromatic.com/docs')).rejects.toThrow('Duplicate');
});
