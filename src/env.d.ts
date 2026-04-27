/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  docsearch(any): boolean;
  plausible(any): boolean;
  Plain?: {
    init: (config: unknown) => void;
    open: (config?: unknown) => void;
    update?: (config: unknown) => void;
    onClose?: (callback: () => void) => () => void;
    isInitialized?: () => boolean;
  };
  Intercom?: (command: string, ...args: unknown[]) => void;
}

interface ImportMetaEnv {
  readonly HYGRAPH_ENDPOINT: string;
}

declare module "remark-link-rewrite" {}
