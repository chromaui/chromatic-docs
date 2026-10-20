/** Shared serialization for the build's rendered article inventory. */
export interface LlmsArticle {
  id: string;
  title: string;
  description: string;
  collection: string;
  discoverable: boolean;
  url: string;
  body: string;
}

const description =
  'Chromatic helps teams test and review UIs with Storybook, React Native, Vitest, Playwright, and Cypress.';

// Keep the existing index organization; new collections get their own section.
const sections: Record<string, string> = {
  overview: 'Overview',
  visualTests: 'Visual Tests',
  modes: 'Visual Tests',
  turbosnap: 'Visual Tests',
  accessibilityTests: 'Accessibility Tests',
  interactionTests: 'Interaction Tests',
  ci: 'CI',
  configuration: 'Configuration',
  snapshot: 'Snapshot',
  guides: 'Guides',
  collaborate: 'Collaborate',
  access: 'Collaborate',
  apiAndAgents: 'API & Agents',
  playwright: 'Playwright',
  cypress: 'Cypress',
  vitest: 'Vitest',
  reactNative: 'React Native',
  account: 'Account',
  troubleshooting: 'Troubleshooting',
  cms: 'Additional documentation',
};

export function sortArticles(articles: LlmsArticle[]): LlmsArticle[] {
  const order = Object.keys(sections);
  const rank = (collection: string) => {
    const index = order.indexOf(collection);
    return index < 0 ? order.length : index;
  };
  return [...articles].sort(
    (a, b) =>
      rank(a.collection) - rank(b.collection) ||
      a.collection.localeCompare(b.collection, 'en') ||
      a.id.localeCompare(b.id, 'en')
  );
}

const line = (value: string) => value.replace(/\s+/g, ' ').trim();
const label = (value: string) => line(value).replace(/[\\[\]]/g, '\\$&');

export function articleMarkdown(article: LlmsArticle): string {
  return `# ${line(article.title)}\n\n> ${line(article.description)}\n\nURL: ${article.url}\n\n${article.body}\n`;
}

export function indexMarkdown(articles: LlmsArticle[], site: string): string {
  const groups = Map.groupBy(
    sortArticles(articles).filter((article) => article.discoverable),
    (article) => sections[article.collection] ?? article.collection
  );
  return [
    '# Chromatic docs',
    `> ${description}`,
    `Read individual articles below, or download the [full documentation](${site}/llms-full.txt).`,
    ...[...groups].map(([section, items]) =>
      [
        `## ${section}`,
        ...items.map(
          (article) =>
            `- [${label(article.title)}](${site}/llms/${article.id}.txt): ${line(article.description)}`
        ),
      ].join('\n')
    ),
    '',
  ].join('\n\n');
}

export function fullMarkdown(articles: LlmsArticle[], site: string): string {
  return [
    '# Chromatic docs',
    `> ${description}`,
    `Site: ${site}`,
    '---',
    ...sortArticles(articles)
      .filter((article) => article.discoverable)
      .map(
        (article) =>
          `## ${line(article.title)}\n\nURL: ${article.url}\n\n> ${line(article.description)}\n\n${article.body}\n\n---`
      ),
    '',
  ].join('\n\n');
}
