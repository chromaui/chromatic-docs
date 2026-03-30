import { expect, test, describe } from "vitest";
import { llmsTxt, llmsFullTxt, llmsDoc, docToLlmsItem, docToFullItem } from "./llms";

function mockDoc(overrides: Record<string, any> = {}) {
  return {
    id: "test-doc",
    collection: "overview",
    data: {
      title: "Test Doc",
      description: "A test document",
    },
    body: "## Hello\n\nSome content here.",
    ...overrides,
  } as any;
}

async function readResponse(response: Response): Promise<string> {
  return response.text();
}

describe("llmsTxt", () => {
  test("generates index with header and sections", async () => {
    const response = llmsTxt({
      name: "Test Site",
      description: "A test site",
      sections: [
        {
          title: "Getting Started",
          items: [
            {
              title: "Introduction",
              description: "Welcome to the site",
              link: "https://example.com/llms/introduction.txt",
            },
          ],
        },
        {
          title: "Guides",
          items: [
            {
              title: "Setup",
              description: "How to set up",
              link: "https://example.com/llms/setup.txt",
            },
            {
              title: "Advanced",
              description: "Advanced usage",
              link: "https://example.com/llms/advanced.txt",
            },
          ],
        },
      ],
    });

    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );

    const text = await readResponse(response);
    expect(text).toContain("# Test Site");
    expect(text).toContain("> A test site");
    expect(text).toContain("## Getting Started");
    expect(text).toContain(
      "- [Introduction](https://example.com/llms/introduction.txt): Welcome to the site",
    );
    expect(text).toContain("## Guides");
    expect(text).toContain(
      "- [Setup](https://example.com/llms/setup.txt): How to set up",
    );
    expect(text).toContain(
      "- [Advanced](https://example.com/llms/advanced.txt): Advanced usage",
    );
  });

  test("filters out empty sections", async () => {
    const response = llmsTxt({
      name: "Test",
      description: "Test",
      sections: [
        { title: "Empty", items: [] },
        {
          title: "Has Items",
          items: [
            { title: "Item", description: "Desc", link: "/llms/item.txt" },
          ],
        },
      ],
    });

    const text = await readResponse(response);
    expect(text).not.toContain("## Empty");
    expect(text).toContain("## Has Items");
  });
});

describe("llmsFullTxt", () => {
  test("generates full content document", async () => {
    const response = llmsFullTxt({
      name: "Test Site",
      description: "A test site",
      site: "https://example.com",
      sections: [],
      docs: [
        {
          title: "First Doc",
          description: "First description",
          link: "https://example.com/first",
          body: "Content of the first doc.",
        },
        {
          title: "Second Doc",
          description: "Second description",
          link: "https://example.com/second",
          body: "Content of the second doc.",
        },
      ],
    });

    const text = await readResponse(response);
    expect(text).toContain("# Test Site");
    expect(text).toContain("Site: https://example.com");
    expect(text).toContain("## First Doc");
    expect(text).toContain("URL: https://example.com/first");
    expect(text).toContain("> First description");
    expect(text).toContain("Content of the first doc.");
    expect(text).toContain("## Second Doc");
    expect(text).toContain("---");
  });

  test("strips MDX from body content", async () => {
    const response = llmsFullTxt({
      name: "Test",
      description: "Test",
      site: "https://example.com",
      sections: [],
      docs: [
        {
          title: "MDX Doc",
          description: "Has MDX",
          link: "https://example.com/mdx",
          body: 'import Component from "./Component";\n\n<Component prop="value">children</Component>\n\nRegular markdown content.\n\n<SelfClosing />',
        },
      ],
    });

    const text = await readResponse(response);
    expect(text).toContain("Regular markdown content.");
    expect(text).not.toContain("import Component");
    expect(text).not.toContain("<Component");
    expect(text).not.toContain("<SelfClosing />");
  });
});

describe("llmsDoc", () => {
  test("generates individual doc page", async () => {
    const doc = mockDoc();
    const response = llmsDoc(doc, "https://example.com");

    const text = await readResponse(response);
    expect(text).toContain("# Test Doc");
    expect(text).toContain("> A test document");
    expect(text).toContain("URL: https://example.com/test-doc");
    expect(text).toContain("## Hello");
    expect(text).toContain("Some content here.");
  });

  test("strips MDX from individual doc", async () => {
    const doc = mockDoc({
      body: 'import Foo from "./Foo";\n\n<Foo bar="baz" />\n\nPlain text.',
    });
    const response = llmsDoc(doc, "https://example.com");

    const text = await readResponse(response);
    expect(text).toContain("Plain text.");
    expect(text).not.toContain("import Foo");
    expect(text).not.toContain("<Foo");
  });

  test("handles missing body gracefully", async () => {
    const doc = mockDoc({ body: undefined });
    const response = llmsDoc(doc, "https://example.com");

    const text = await readResponse(response);
    expect(text).toContain("# Test Doc");
  });
});

describe("docToLlmsItem", () => {
  test("converts doc entry to index item", () => {
    const doc = mockDoc();
    const item = docToLlmsItem(doc, "https://example.com/llms");

    expect(item).toEqual({
      title: "Test Doc",
      description: "A test document",
      link: "https://example.com/llms/test-doc.txt",
    });
  });

  test("falls back to title when description is missing", () => {
    const doc = mockDoc({ data: { title: "No Desc", description: "" } });
    const item = docToLlmsItem(doc, "https://example.com/llms");

    expect(item.description).toBe("No Desc");
  });
});

describe("docToFullItem", () => {
  test("converts doc entry to full content item", () => {
    const doc = mockDoc();
    const item = docToFullItem(doc, "https://example.com");

    expect(item).toEqual({
      title: "Test Doc",
      description: "A test document",
      link: "https://example.com/test-doc",
      body: "## Hello\n\nSome content here.",
    });
  });
});
