const readStoredTab = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    // Storage may be unavailable (e.g. strict privacy settings).
    return null;
  }
};

const writeStoredTab = (key: string, label: string) => {
  try {
    localStorage.setItem(key, label);
  } catch {
    // Storage may be unavailable (e.g. strict privacy settings).
  }
};

export class CodeSnippetTabs extends HTMLElement {
  tabs: HTMLAnchorElement[] = [];
  panels: HTMLElement[] = [];
  storageKey: string | null = null;

  connectedCallback() {
    this.storageKey = this.getAttribute('data-persist-key');

    const tablist = this.querySelector<HTMLUListElement>('[role="tablist"]')!;
    this.tabs = [...tablist.querySelectorAll<HTMLAnchorElement>('[role="tab"]')];
    this.panels = [...this.querySelectorAll<HTMLElement>(':scope > [role="tabpanel"]')];

    // Default to the last tab the user selected, if it exists in this group.
    const storedLabel = this.storageKey && readStoredTab(this.storageKey);
    if (storedLabel) {
      const index = this.tabs.findIndex((tab) => tab.textContent?.trim() === storedLabel);
      if (index > 0) this.switchTab(this.tabs[index], index, false);
    }

    this.tabs.forEach((tab, i) => {
      // Handle clicks for mouse users
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTab = tablist.querySelector('[aria-selected]');
        if (e.currentTarget !== currentTab) {
          this.switchTab(e.currentTarget as HTMLAnchorElement, i);
        }
      });

      // Handle keyboard input
      tab.addEventListener('keydown', (e) => {
        const index = this.tabs.indexOf(e.currentTarget as HTMLAnchorElement);
        // Work out which key the user is pressing and
        // Calculate the new tab's index where appropriate
        const nextIndex =
          e.key === 'ArrowLeft'
            ? index - 1
            : e.key === 'ArrowRight'
              ? index + 1
              : e.key === 'Home'
                ? 0
                : e.key === 'End'
                  ? this.tabs.length - 1
                  : null;
        if (nextIndex === null) return;
        if (this.tabs[nextIndex]) {
          e.preventDefault();
          this.switchTab(this.tabs[nextIndex], nextIndex);
        }
      });
    });
  }

  switchTab(newTab: HTMLAnchorElement | null | undefined, index: number, focus = true) {
    if (!newTab) return;

    // Mark all tabs as unselected and hide all tab panels.
    this.tabs.forEach((tab) => {
      tab.removeAttribute('aria-selected');
      tab.setAttribute('tabindex', '-1');
    });
    this.panels.forEach((oldPanel) => {
      oldPanel.hidden = true;
    });

    // Show new panel and mark new tab as selected.
    const newPanel = this.panels[index];
    if (newPanel) newPanel.hidden = false;
    // Restore active tab to the default tab order.
    newTab.removeAttribute('tabindex');
    newTab.setAttribute('aria-selected', 'true');
    if (focus) newTab.focus();

    // Remember the user's choice so other tab groups can default to it.
    if (this.storageKey && newTab.textContent) {
      writeStoredTab(this.storageKey, newTab.textContent.trim());
    }
  }
}

if (!customElements.get('code-snippet-tabs')) {
  customElements.define('code-snippet-tabs', CodeSnippetTabs);
}
