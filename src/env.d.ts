/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  docsearch(any): boolean;
  formbricks: any;
}

interface ImportMetaEnv {
  readonly HYGRAPH_ENDPOINT: string;
}
