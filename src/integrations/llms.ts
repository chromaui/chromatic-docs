import type { AstroIntegration } from 'astro';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { articleFromHtml } from '../utils/llms-html';
import { articleMarkdown, fullMarkdown, indexMarkdown, type LlmsArticle } from '../utils/llms';

/** Export only completed pages: no extra rendering, HTTP requests, or CMS fetch. */
export async function exportLlms(dir: string, site: string): Promise<LlmsArticle[]> {
  const articles: LlmsArticle[] = [];
  const ids = new Set<string>();
  const files = (await readdir(dir, { recursive: true }))
    .filter((file) => file.endsWith('.html'))
    .sort();
  for (const file of files) {
    const path = file.split(sep).join('/');
    if (path === '404.html' || path === '404/index.html' || path.startsWith('_')) continue;
    const route = path
      .replace(/(^|\/)index\.html$/, '')
      .replace(/\.html$/, '')
      .replace(/\/$/, '');
    const url = route ? `${site}/${route}` : site;
    const article = articleFromHtml(await readFile(join(dir, file), 'utf8'), url);
    if (!article) continue;
    if (ids.has(article.id)) throw new Error(`Duplicate LLM article id: ${article.id}`);
    ids.add(article.id);
    articles.push(article);
  }
  if (!articles.length) throw new Error('No rendered LLM articles found');

  // Replace the previous inventory so removed articles cannot leave stale files.
  await rm(join(dir, 'llms'), { recursive: true, force: true });
  for (const article of articles) {
    const path = join(dir, 'llms', `${article.id}.txt`);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, articleMarkdown(article));
  }
  await writeFile(join(dir, 'llms.txt'), indexMarkdown(articles, site));
  await writeFile(join(dir, 'llms-full.txt'), fullMarkdown(articles, site));

  // Validate actual artifacts, including all discovery links, before deploy.
  const index = await readFile(join(dir, 'llms.txt'), 'utf8');
  const full = await readFile(join(dir, 'llms-full.txt'), 'utf8');
  const indexedIds = [...index.matchAll(/^- \[.*\]\(.+\/llms\/(.+)\.txt\):/gm)].map(
    (match) => match[1]
  );
  const corpusUrls = [...full.matchAll(/^URL: (https?:\/\/\S+)$/gm)].map((match) => match[1]);
  const eligible = articles.filter((article) => article.discoverable);
  if (indexedIds.length !== eligible.length || corpusUrls.length !== eligible.length) {
    throw new Error('LLM index/corpus coverage does not match rendered articles');
  }
  for (const article of articles) {
    if (
      indexedIds.filter((id) => id === article.id).length !== Number(article.discoverable) ||
      corpusUrls.filter((url) => url === article.url).length !== Number(article.discoverable) ||
      (await readFile(join(dir, 'llms', `${article.id}.txt`), 'utf8')) !== articleMarkdown(article)
    ) {
      throw new Error(`Inconsistent LLM export: ${article.id}`);
    }
  }
  return articles;
}

export function llmsIntegration(): AstroIntegration {
  let site: string;
  return {
    name: 'rendered-llms-exports',
    hooks: {
      'astro:config:done': ({ config }) => {
        if (!config.site) throw new Error('LLM exports require a configured site URL');
        site = new URL(config.base, config.site).href.replace(/\/$/, '');
      },
      'astro:build:done': async ({ dir, logger }) => {
        const articles = await exportLlms(fileURLToPath(dir), site);
        logger.info(
          `Exported ${articles.length} articles (${articles.filter((article) => article.discoverable).length} indexed)`
        );
      },
    },
  };
}
