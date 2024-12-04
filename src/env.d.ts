/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  docsearch(any): boolean;
  plausible(any): boolean;
}

interface ImportMetaEnv {
  readonly HYGRAPH_ENDPOINT: string;
}

declare module "remark-link-rewrite" {}
