import type { MarkdownProcessorRenderOptions } from "@astrojs/markdown-remark";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";

const processor = await createMarkdownProcessor({});

export async function markdown(
  content: string,
  options?: MarkdownProcessorRenderOptions,
) {
  const result = await processor.render(content, options);
  return result.code.indexOf("<p>") === 0 &&
    result.code.indexOf("</p>") === result.code.length - 4
    ? result.code.slice(3, -4)
    : result.code;
}
