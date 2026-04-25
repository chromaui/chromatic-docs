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
  readonly PUBLIC_CHROMATIC_PLAIN_APP_ID?: string;
  readonly PUBLIC_CHROMATIC_INTERCOM_APP_ID?: string;
}

declare module "remark-link-rewrite" {}
