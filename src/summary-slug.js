import GitHubSlugger from "github-slugger";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

const slugs = new GitHubSlugger();

function isMdSummary(node) {
  const name = node.type === "element" ? node.tagName.toLowerCase() : "";
  return name === "summary";
}

function isMdxSummary(node) {
  const name = node.type === "mdxJsxFlowElement" ? node.name.toLowerCase() : "";
  return (
    name === "summary" && !node.attributes.some((attr) => attr.name === "id")
  );
}

/**
 * Add `id`s details > summary
 */
export function summarySlug() {
  return function (tree) {
    slugs.reset();

    visit(
      tree,
      ({ type }) => {
        return type === "element" || type === "mdxJsxFlowElement";
      },
      function (node) {
        if (isMdSummary(node) && !node.properties.id) {
          node.properties.id = slugs.slug(toString(node));
        } else if (isMdxSummary(node)) {
          node.attributes.push({
            type: "mdxJsxAttribute",
            name: "id",
            value: slugs.slug(toString(node)),
          });
        }
      },
    );
  };
}
