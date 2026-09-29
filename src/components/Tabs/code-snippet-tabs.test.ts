// @vitest-environment happy-dom
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { CodeSnippetTabs } from './code-snippet-tabs';

const KEY = 'chromatic-docs:test-tabs';

const createStorageMock = () => {
  const store = new Map<string, string>();
  return {
    store,
    getItem: vi.fn((key: string) => (store.has(key) ? store.get(key)! : null)),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, String(value));
    }),
  };
};

let storage: ReturnType<typeof createStorageMock>;

beforeEach(() => {
  storage = createStorageMock();
  vi.stubGlobal('localStorage', storage);
  document.body.innerHTML = '';
});

const buildTabs = (labels: string[], persistKey?: string) => {
  const el = document.createElement('code-snippet-tabs');
  if (persistKey) el.setAttribute('data-persist-key', persistKey);
  el.innerHTML = `
    <ul role="tablist">
      ${labels
        .map(
          (label, i) =>
            `<li role="presentation"><a role="tab" href="#panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${label}</a></li>`
        )
        .join('')}
    </ul>
    ${labels
      .map(
        (label, i) =>
          `<div role="tabpanel" id="panel-${i}"${i === 0 ? '' : ' hidden'}>${label} panel</div>`
      )
      .join('')}
  `;
  document.body.appendChild(el);
  return el;
};

const selectedTab = (el: CodeSnippetTabs) =>
  el.querySelector('[aria-selected="true"]')?.textContent?.trim();

const visiblePanels = (el: CodeSnippetTabs) =>
  [...el.querySelectorAll<HTMLElement>('[role="tabpanel"]')]
    .filter((panel) => !panel.hidden)
    .map((panel) => panel.textContent?.trim());

describe('CodeSnippetTabs persistence', () => {
  test('restores the stored tab on connect without stealing focus', () => {
    storage.store.set(KEY, 'Playwright');
    const el = buildTabs(['Storybook', 'Vitest', 'Playwright'], KEY);

    expect(selectedTab(el)).toBe('Playwright');
    expect(visiblePanels(el)).toEqual(['Playwright panel']);
    // Restoration must not move keyboard focus to the restored tab.
    expect(document.activeElement).not.toBe(el.tabs[2]);
  });

  test('falls back to the first tab when the stored label is not in the group', () => {
    storage.store.set(KEY, 'GitHub');
    const el = buildTabs(['Storybook', 'Vitest', 'Playwright'], KEY);

    expect(selectedTab(el)).toBe('Storybook');
    expect(visiblePanels(el)).toEqual(['Storybook panel']);
  });

  test('writes the selected label on click', () => {
    const el = buildTabs(['Storybook', 'Vitest', 'Playwright'], KEY);

    el.tabs[1].click();

    expect(storage.setItem).toHaveBeenCalledWith(KEY, 'Vitest');
    expect(storage.store.get(KEY)).toBe('Vitest');
    expect(selectedTab(el)).toBe('Vitest');
    expect(visiblePanels(el)).toEqual(['Vitest panel']);

    // Clicking the already-selected tab must not rewrite storage.
    el.tabs[1].click();
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });

  test('never touches storage when no persistKey is set', () => {
    const el = buildTabs(['Storybook', 'Vitest', 'Playwright']);

    el.tabs[1].click();

    expect(selectedTab(el)).toBe('Vitest');
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  test('persists keyboard navigation', () => {
    const el = buildTabs(['Storybook', 'Vitest', 'Playwright'], KEY);

    el.tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(selectedTab(el)).toBe('Vitest');
    expect(storage.store.get(KEY)).toBe('Vitest');

    el.tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    expect(selectedTab(el)).toBe('Playwright');
    expect(storage.store.get(KEY)).toBe('Playwright');
  });

  test('survives storage that throws (strict privacy modes)', () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => {
        throw new Error('blocked');
      }),
      setItem: vi.fn(() => {
        throw new Error('blocked');
      }),
    });

    const el = buildTabs(['Storybook', 'Vitest', 'Playwright'], KEY);

    expect(selectedTab(el)).toBe('Storybook');
    expect(() => el.tabs[1].click()).not.toThrow();
    expect(selectedTab(el)).toBe('Vitest');
  });
});
