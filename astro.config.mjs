import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeMermaid from "@beoe/rehype-mermaid";
import { rehypeShiki } from "@astrojs/markdown-remark";
import { h, s } from "hastscript";
import {
  transformerNotationHighlight,
  transformerNotationDiff,
} from "@shikijs/transformers";

// https://astro.build/config
export default defineConfig({
  site: "https://chromatic.com/docs",
  base: "/docs",
  trailingSlash: "never",
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeMermaid,
        {
          strategy: "img-svg",
          mermaidConfig: {
            theme: "neutral",
            themeVariables: {
              commitLabelFontSize: "14px",
              tagLabelFontSize: "14px",
            },
          },
        },
      ],
      // Manually configure shiki so that we can use mermaid alongside it
      [
        rehypeShiki,
        {
          theme: "github-light",
          transformers: [
            transformerNotationHighlight(),
            transformerNotationDiff(),
          ],
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            class: "autolink-header",
            ariaHidden: true,
            tabIndex: -1,
          },
          content: [
            s(
              "svg.autolink-svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                width: 14,
                height: 14,
                fill: "currentColor",
                viewBox: "0 0 14 14",
                ariaLabel: "Link to this section",
              },
              s("path", {
                d: "M11.841 2.159a2.25 2.25 0 0 0-3.182 0l-2.5 2.5a2.25 2.25 0 0 0 0 3.182.5.5 0 0 1-.707.707 3.25 3.25 0 0 1 0-4.596l2.5-2.5a3.25 3.25 0 0 1 4.596 4.596l-2.063 2.063a4.27 4.27 0 0 0-.094-1.32l1.45-1.45a2.25 2.25 0 0 0 0-3.182Z",
              }),
              s("path", {
                d: "M3.61 7.21c-.1-.434-.132-.88-.095-1.321L1.452 7.952a3.25 3.25 0 1 0 4.596 4.596l2.5-2.5a3.25 3.25 0 0 0 0-4.596.5.5 0 0 0-.707.707 2.25 2.25 0 0 1 0 3.182l-2.5 2.5A2.25 2.25 0 1 1 2.159 8.66l1.45-1.45Z",
              }),
            ),
          ],
        },
      ],
    ],
  },
  integrations: [react(), mdx(), sitemap()],
});
