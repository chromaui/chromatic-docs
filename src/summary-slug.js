import GithubSlugger from "github-slugger";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

const slugs = new GithubSlugger();

function isSummary(node) {
  const name = node.type === "element" ? node.tagName.toLowerCase() : "";
  return name === "summary";
}

/**
 * Add `id`s details > summary
 */
export function summarySlug() {
  return function (tree) {
    slugs.reset();

    visit(tree, "element", function (node) {
      if (isSummary(node) && !node.properties.id) {
        node.properties.id = slugs.slug(toString(node));
      }
    });
  };
}
