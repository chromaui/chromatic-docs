/**
 * Detects shell prompt lines (leading `$`) inside shell-tagged fenced code
 * blocks. Regression guard for the docs content: copied commands must be
 * runnable as-is, so fences tagged shell/bash/sh must not carry prompt
 * decoration. Comment lines and fence metadata are never flagged.
 */

export interface ShellPromptHit {
  file: string;
  /** 1-indexed line number within the file. */
  line: number;
  text: string;
}

export const SHELL_FENCE_LANGUAGES = new Set(['shell', 'bash', 'sh']);

const FENCE_OPEN = /^\s*`{3,}\s*(\S*)/;
const SHELL_PROMPT = /^\s*\$(\s|$)/;

function fenceLanguage(fenceLine: string): string {
  return FENCE_OPEN.exec(fenceLine)?.[1] ?? '';
}

/**
 * Returns every `$`-prompt line found inside a shell-tagged fence, in file
 * order. A line is a prompt when its first non-whitespace character is `$`
 * followed by a space (or the line is just `$`).
 */
export function findShellPromptLines({
  path,
  content,
}: {
  path: string;
  content: string;
}): ShellPromptHit[] {
  const hits: ShellPromptHit[] = [];
  let inFence = false;
  let isShellFence = false;

  content.split('\n').forEach((text, index) => {
    if (text.trimStart().startsWith('```')) {
      if (!inFence) {
        inFence = true;
        isShellFence = SHELL_FENCE_LANGUAGES.has(fenceLanguage(text));
      } else {
        inFence = false;
        isShellFence = false;
      }
      return;
    }

    if (inFence && isShellFence && SHELL_PROMPT.test(text)) {
      hits.push({ file: path, line: index + 1, text });
    }
  });

  return hits;
}
