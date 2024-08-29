import { expect, test, describe } from "vitest";
import type { NavGroup } from "./types";
import { transformNavGroups } from "./transform-nav-groups";

const mockGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        id: "diff-inspector.mdx",
        slug: "diff-inspector",
        collection: "overview",
        data: {
          title: "Diff Inspector",
          sidebar: {
            label: "Diff Inspector",
            order: 5,
            hide: false,
          },
        },
      },
      {
        id: "introduction.mdx",
        slug: "introduction",
        collection: "overview",
        data: {
          title: "Introduction",
          sidebar: {
            label: "Introduction",
            order: 1,
            hide: false,
          },
          isHome: true,
        },
      },
      {
        id: "test.mdx",
        slug: "test",
        collection: "overview",
        data: {
          title: "Test",
          sidebar: {
            label: "UI Tests",
            order: 2,
            hide: false,
          },
        },
      },
      {
        id: "ci.mdx",
        slug: "ci",
        collection: "overview",
        data: {
          title: "Automate with CI",
          sidebar: {
            label: "Automate with CI",
            order: 4,
            hide: false,
          },
        },
      },
      {
        id: "review.md",
        slug: "review",
        collection: "overview",
        data: {
          title: "Review",
          sidebar: {
            label: "UI Review",
            order: 3,
            hide: false,
          },
        },
      },
    ],
  },
  {
    title: "Storybook",
    items: [
      {
        id: "setup.mdx",
        slug: "storybook",
        collection: "storybook",
        data: {
          title: "Setup",
          sidebar: {
            label: "Setup",
            order: 1,
            hide: false,
          },
        },
      },
      {
        id: "interactions.md",
        slug: "interactions",
        collection: "storybook",
        data: {
          title: "Interaction tests",
          sidebar: {
            label: "Interaction tests",
            order: 2,
            hide: false,
          },
        },
      },
      {
        id: "publish.md",
        slug: "storybook/publish",
        collection: "storybook",
        data: {
          title: "Publish",
          sidebar: {
            label: "Publish",
            order: 3,
            hide: false,
          },
        },
      },
      {
        id: "composition.md",
        slug: "composition",
        collection: "storybook",
        data: {
          title: "Composition",
          sidebar: {
            label: "Composition",
            order: 4,
            hide: false,
          },
        },
      },

      {
        title: "Modes",
        items: [
          {
            id: "modes.mdx",
            slug: "modes",
            collection: "modes",
            data: {
              title: "Story Modes",
              sidebar: {
                label: "Story Modes",
                order: 1,
                hide: false,
              },
            },
          },
          {
            id: "legacy-viewports.md",
            slug: "legacy-viewports",
            collection: "modes",
            data: {
              title: "Viewports (legacy)",
              sidebar: {
                label: "Viewports (legacy)",
                order: 5,
                hide: false,
              },
            },
          },
          {
            id: "themes.md",
            slug: "themes",
            collection: "modes",
            data: {
              title: "Themes",
              sidebar: {
                label: "Themes",
                order: 3,
                hide: false,
              },
            },
          },
          {
            id: "custom-decorators.md",
            slug: "custom-decorators",
            collection: "modes",
            data: {
              title: "Custom decorators and globals",
              sidebar: {
                label: "Custom decorators",
                order: 4,
                hide: false,
              },
            },
          },
          {
            id: "viewports.mdx",
            slug: "viewports",
            collection: "modes",
            data: {
              title: "Viewports",
              sidebar: {
                label: "Viewports",
                order: 2,
                hide: true,
              },
            },
          },
        ],
      },
    ],
  },
];

describe("transformNavGroups", () => {
  test("Uses sidebar label when defined", () => {
    expect(
      transformNavGroups([
        {
          title: "Overview",
          items: [
            {
              id: "test.mdx",
              slug: "test",
              collection: "overview",
              data: {
                title: "Test",
                sidebar: {
                  label: "UI Tests",
                  order: 2,
                  hide: false,
                },
              },
            },
          ],
        },
      ]),
    ).toEqual([
      {
        title: "Overview",
        items: [
          {
            hide: false,
            label: "UI Tests",
            order: 2,
            slug: "test",
          },
        ],
      },
    ]);
  });

  test("Uses title when sidebar label is not defined", () => {
    expect(
      transformNavGroups([
        {
          title: "Overview",
          items: [
            {
              id: "test.mdx",
              slug: "test",
              collection: "overview",
              data: {
                title: "Test",
                sidebar: {
                  order: 2,
                  hide: false,
                },
              },
            },
          ],
        },
      ]),
    ).toEqual([
      {
        title: "Overview",
        items: [
          {
            hide: false,
            label: "Test",
            order: 2,
            slug: "test",
          },
        ],
      },
    ]);
  });

  test("Sets empty slug when isHome is true", () => {
    expect(
      transformNavGroups([
        {
          title: "Overview",
          items: [
            {
              id: "introduction.mdx",
              slug: "introduction",
              collection: "overview",
              data: {
                title: "Introduction",
                sidebar: {
                  label: "Introduction",
                  order: 1,
                  hide: false,
                },
                isHome: true,
              },
            },
          ],
        },
      ]),
    ).toEqual([
      {
        title: "Overview",
        items: [
          {
            hide: false,
            label: "Introduction",
            order: 1,
            slug: "",
          },
        ],
      },
    ]);
  });

  test("Sets order to 999 when not specified", () => {
    expect(
      transformNavGroups([
        {
          title: "Overview",
          items: [
            {
              id: "test.mdx",
              slug: "test",
              collection: "overview",
              data: {
                title: "Test",
                sidebar: {
                  label: "UI Tests",
                  hide: false,
                },
              },
            },
          ],
        },
      ]),
    ).toEqual([
      {
        title: "Overview",
        items: [
          {
            hide: false,
            label: "UI Tests",
            order: 999,
            slug: "test",
          },
        ],
      },
    ]);
  });

  test("Sets hide to false when not specified", () => {
    expect(
      transformNavGroups([
        {
          title: "Overview",
          items: [
            {
              id: "test.mdx",
              slug: "test",
              collection: "overview",
              data: {
                title: "Test",
                sidebar: {
                  label: "UI Tests",
                  order: 2,
                },
              },
            },
          ],
        },
      ]),
    ).toEqual([
      {
        title: "Overview",
        items: [
          {
            hide: false,
            label: "UI Tests",
            order: 2,
            slug: "test",
          },
        ],
      },
    ]);
  });

  test("transforms and sorts single level groups", () => {
    expect(transformNavGroups([mockGroups[0]])).toEqual([
      {
        title: "Overview",
        items: [
          {
            hide: false,
            label: "Introduction",
            order: 1,
            slug: "",
          },
          {
            hide: false,
            label: "UI Tests",
            order: 2,
            slug: "test",
          },
          {
            hide: false,
            label: "UI Review",
            order: 3,
            slug: "review",
          },
          {
            hide: false,
            label: "Automate with CI",
            order: 4,
            slug: "ci",
          },
          {
            hide: false,
            label: "Diff Inspector",
            order: 5,
            slug: "diff-inspector",
          },
        ],
      },
    ]);
  });

  test("filters hidden items", () => {
    expect(
      transformNavGroups([
        {
          title: "Overview",
          items: [
            {
              id: "diff-inspector.mdx",
              slug: "diff-inspector",
              collection: "overview",
              data: {
                title: "Diff Inspector",
                sidebar: {
                  label: "Diff Inspector",
                  order: 5,
                  hide: false,
                },
              },
            },
            {
              id: "ci.mdx",
              slug: "ci",
              collection: "overview",
              data: {
                title: "Automate with CI",
                sidebar: {
                  label: "Automate with CI",
                  order: 4,
                  hide: true,
                },
              },
            },
            {
              id: "introduction.mdx",
              slug: "introduction",
              collection: "overview",
              data: {
                title: "Introduction",
                sidebar: {
                  label: "Introduction",
                  order: 1,
                  hide: false,
                },
                isHome: true,
              },
            },
          ],
        },
      ]),
    ).toEqual([
      {
        title: "Overview",
        items: [
          {
            hide: false,
            label: "Introduction",
            order: 1,
            slug: "",
          },
          {
            hide: false,
            label: "Diff Inspector",
            order: 5,
            slug: "diff-inspector",
          },
        ],
      },
    ]);
  });

  test("transforms and sorts nested groups", () => {
    expect(transformNavGroups([mockGroups[1]])).toEqual([
      {
        title: "Storybook",
        items: [
          {
            hide: false,
            label: "Setup",
            order: 1,
            slug: "storybook",
          },
          {
            hide: false,
            label: "Interaction tests",
            order: 2,
            slug: "interactions",
          },
          {
            hide: false,
            label: "Publish",
            order: 3,
            slug: "storybook/publish",
          },
          {
            hide: false,
            label: "Composition",
            order: 4,
            slug: "composition",
          },
          {
            hide: false,
            items: [
              {
                hide: false,
                label: "Story Modes",
                order: 1,
                slug: "modes",
              },
              {
                hide: false,
                label: "Themes",
                order: 3,
                slug: "themes",
              },
              {
                hide: false,
                label: "Custom decorators",
                order: 4,
                slug: "custom-decorators",
              },
              {
                hide: false,
                label: "Viewports (legacy)",
                order: 5,
                slug: "legacy-viewports",
              },
            ],
            order: 999,
            title: "Modes",
          },
        ],
      },
    ]);
  });
});
