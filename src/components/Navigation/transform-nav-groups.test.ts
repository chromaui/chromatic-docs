import { expect, test, describe } from "vitest";
import type { NavGroup } from "./types";
import { transformNavGroups, flattenGroups } from "./transform-nav-groups";

const mockGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        id: "diff-inspector",
        collection: "overview",
        data: {
          title: "Diff Inspector",
          description: "Diff Inspector",
          sidebar: {
            label: "Diff Inspector",
            order: 5,
            hide: false,
          },
        },
      },
      {
        id: "introduction",
        collection: "overview",
        data: {
          title: "Introduction",
          description: "Introduction",
          sidebar: {
            label: "Introduction",
            order: 1,
            hide: false,
          },
          isHome: true,
        },
      },
      {
        id: "test",
        collection: "overview",
        data: {
          title: "Test",
          description: "Test",
          sidebar: {
            label: "UI Tests",
            order: 2,
            hide: false,
          },
        },
      },
      {
        id: "ci",
        collection: "overview",
        data: {
          title: "Automate with CI",
          description: "Automate with CI",
          sidebar: {
            label: "Automate with CI",
            order: 4,
            hide: false,
          },
        },
      },
      {
        id: "review",
        collection: "overview",
        data: {
          title: "Review",
          description: "Review",
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
        id: "storybook",
        collection: "troubleshooting",
        data: {
          title: "Setup",
          description: "Setup",
          sidebar: {
            label: "Setup",
            order: 1,
            hide: false,
          },
        },
      },
      {
        id: "interactions",
        collection: "troubleshooting",
        data: {
          title: "Interaction tests",
          description: "Interaction tests",
          sidebar: {
            label: "Interaction tests",
            order: 2,
            hide: false,
          },
        },
      },
      {
        id: "storybook/publish",
        collection: "troubleshooting",
        data: {
          title: "Publish",
          description: "Publish",
          sidebar: {
            label: "Publish",
            order: 3,
            hide: false,
          },
        },
      },
      {
        id: "composition",
        collection: "troubleshooting",
        data: {
          title: "Composition",
          description: "Composition",
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
            id: "modes",
            collection: "modes",
            data: {
              title: "Story Modes",
              description: "Story Modes",
              sidebar: {
                label: "Story Modes",
                order: 1,
                hide: false,
              },
            },
          },
          {
            id: "legacy-viewports",
            collection: "modes",
            data: {
              title: "Viewports (legacy)",
              description: "Viewports (legacy)",
              sidebar: {
                label: "Viewports (legacy)",
                order: 5,
                hide: false,
              },
            },
          },
          {
            id: "themes",
            collection: "modes",
            data: {
              title: "Themes",
              description: "Themes",
              sidebar: {
                label: "Themes",
                order: 3,
                hide: false,
              },
            },
          },
          {
            id: "custom-decorators",
            collection: "modes",
            data: {
              title: "Custom decorators and globals",
              description: "Custom decorators and globals",
              sidebar: {
                label: "Custom decorators",
                order: 4,
                hide: false,
              },
            },
          },
          {
            id: "viewports",
            collection: "modes",
            data: {
              title: "Viewports",
              description: "Viewports",
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

describe("transformNavGroups > Defaults", () => {
  test("Uses sidebar label when defined", () => {
    expect(
      transformNavGroups([
        {
          title: "Overview",
          items: [
            {
              id: "test",
              collection: "overview",
              data: {
                title: "Test",
                description: "Test",
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
            id: "test",
            isHome: false,
            breadcrumb: "Overview",
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
              id: "test",
              collection: "overview",
              data: {
                title: "Test",
                description: "Test",
                sidebar: {
                  order: 2,
                  hide: false,
                },
                isHome: false,
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
            id: "test",
            isHome: false,
            breadcrumb: "Overview",
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
              id: "introduction",
              collection: "overview",
              data: {
                title: "Introduction",
                description: "Introduction",
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
            id: "",
            isHome: true,
            breadcrumb: "Overview",
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
              id: "test",
              collection: "overview",
              data: {
                title: "Test",
                description: "Test",
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
            id: "test",
            isHome: false,
            breadcrumb: "Overview",
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
              id: "test",
              collection: "overview",
              data: {
                title: "Test",
                description: "Test",
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
            id: "test",
            isHome: false,
            breadcrumb: "Overview",
          },
        ],
      },
    ]);
  });
});

describe("transformNavGroups > Nested defaults", () => {
  test("Sets nested group's order to 999 when not specified", () => {
    expect(
      transformNavGroups([
        {
          title: "Storybook",
          items: [
            {
              title: "Modes",
              items: [
                {
                  id: "modes",
                  collection: "modes",
                  data: {
                    title: "Story Modes",
                    description: "Story Modes",
                    sidebar: {
                      label: "Story Modes",
                      hide: false,
                    },
                  },
                },
              ],
            },
          ],
        },
      ]),
    ).toEqual([
      {
        title: "Storybook",
        items: [
          {
            hide: false,
            title: "Modes",
            order: 999,
            items: [
              {
                hide: false,
                label: "Story Modes",
                order: 999,
                id: "modes",
                isHome: false,
                breadcrumb: "Storybook » Modes",
              },
            ],
          },
        ],
      },
    ]);
  });

  test("Sets nested group's hide to false when not specified", () => {
    expect(
      transformNavGroups([
        {
          title: "Storybook",
          items: [
            {
              title: "Modes",
              items: [
                {
                  id: "modes",
                  collection: "modes",
                  data: {
                    title: "Story Modes",
                    description: "Story Modes",
                    sidebar: {
                      label: "Story Modes",
                    },
                  },
                },
              ],
            },
          ],
        },
      ]),
    ).toEqual([
      {
        title: "Storybook",
        items: [
          {
            hide: false,
            title: "Modes",
            order: 999,
            items: [
              {
                hide: false,
                label: "Story Modes",
                order: 999,
                id: "modes",
                isHome: false,
                breadcrumb: "Storybook » Modes",
              },
            ],
          },
        ],
      },
    ]);
  });
});

describe("transformNavGroups > Sorting & filtering", () => {
  test("transforms and sorts single level groups", () => {
    expect(transformNavGroups([mockGroups[0]])).toEqual([
      {
        title: "Overview",
        items: [
          {
            hide: false,
            label: "Introduction",
            order: 1,
            id: "",
            isHome: true,
            breadcrumb: "Overview",
          },
          {
            hide: false,
            label: "UI Tests",
            order: 2,
            id: "test",
            isHome: false,
            breadcrumb: "Overview",
          },
          {
            hide: false,
            label: "UI Review",
            order: 3,
            id: "review",
            isHome: false,
            breadcrumb: "Overview",
          },
          {
            hide: false,
            label: "Automate with CI",
            order: 4,
            id: "ci",
            isHome: false,
            breadcrumb: "Overview",
          },
          {
            hide: false,
            label: "Diff Inspector",
            order: 5,
            id: "diff-inspector",
            isHome: false,
            breadcrumb: "Overview",
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
              id: "diff-inspector",
              collection: "overview",
              data: {
                title: "Diff Inspector",
                description: "Diff Inspector",
                sidebar: {
                  label: "Diff Inspector",
                  order: 5,
                  hide: false,
                },
              },
            },
            {
              id: "ci",
              collection: "overview",
              data: {
                title: "Automate with CI",
                description: "Automate with CI",
                sidebar: {
                  label: "Automate with CI",
                  order: 4,
                  hide: true,
                },
              },
            },
            {
              id: "introduction",
              collection: "overview",
              data: {
                title: "Introduction",
                description: "Introduction",
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
            id: "",
            isHome: true,
            breadcrumb: "Overview",
          },
          {
            hide: false,
            label: "Diff Inspector",
            order: 5,
            id: "diff-inspector",
            isHome: false,
            breadcrumb: "Overview",
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
            id: "storybook",
            isHome: false,
            breadcrumb: "Storybook",
          },
          {
            hide: false,
            label: "Interaction tests",
            order: 2,
            id: "interactions",
            isHome: false,
            breadcrumb: "Storybook",
          },
          {
            hide: false,
            label: "Publish",
            order: 3,
            id: "storybook/publish",
            isHome: false,
            breadcrumb: "Storybook",
          },
          {
            hide: false,
            label: "Composition",
            order: 4,
            id: "composition",
            isHome: false,
            breadcrumb: "Storybook",
          },
          {
            hide: false,
            items: [
              {
                hide: false,
                label: "Story Modes",
                order: 1,
                id: "modes",
                isHome: false,
                breadcrumb: "Storybook » Modes",
              },
              {
                hide: false,
                label: "Themes",
                order: 3,
                id: "themes",
                isHome: false,
                breadcrumb: "Storybook » Modes",
              },
              {
                hide: false,
                label: "Custom decorators",
                order: 4,
                id: "custom-decorators",
                isHome: false,
                breadcrumb: "Storybook » Modes",
              },
              {
                hide: false,
                label: "Viewports (legacy)",
                order: 5,
                id: "legacy-viewports",
                isHome: false,
                breadcrumb: "Storybook » Modes",
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

describe("transformNavGroups > Breadcrumbs", () => {
  test("Generates breadcrumbs for single level groups", () => {
    expect(
      transformNavGroups([
        {
          title: "Storybook",
          items: [
            {
              id: "storybook",
              collection: "troubleshooting",
              data: {
                title: "Setup",
                description: "Setup",
                sidebar: {
                  label: "Setup",
                  order: 1,
                  hide: false,
                },
              },
            },
            {
              id: "interactions",
              collection: "troubleshooting",
              data: {
                title: "Interaction tests",
                description: "Interaction tests",
                sidebar: {
                  label: "Interaction tests",
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
        title: "Storybook",
        items: [
          {
            hide: false,
            label: "Setup",
            order: 1,
            id: "storybook",
            isHome: false,
            breadcrumb: "Storybook",
          },
          {
            hide: false,
            label: "Interaction tests",
            order: 2,
            id: "interactions",
            isHome: false,
            breadcrumb: "Storybook",
          },
        ],
      },
    ]);
  });

  test("Generates breadcrumbs for nested groups", () => {
    expect(
      transformNavGroups([
        {
          title: "Storybook",
          items: [
            {
              id: "composition",
              collection: "troubleshooting",
              data: {
                title: "Composition",
                description: "Composition",
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
                  id: "modes",
                  collection: "modes",
                  data: {
                    title: "Story Modes",
                    description: "Story Modes",
                    sidebar: {
                      label: "Story Modes",
                      order: 1,
                      hide: false,
                    },
                  },
                },
              ],
            },
          ],
        },
      ]),
    ).toEqual([
      {
        title: "Storybook",
        items: [
          {
            hide: false,
            label: "Composition",
            order: 4,
            id: "composition",
            isHome: false,
            breadcrumb: "Storybook",
          },
          {
            hide: false,
            items: [
              {
                hide: false,
                label: "Story Modes",
                order: 1,
                id: "modes",
                isHome: false,
                breadcrumb: "Storybook » Modes",
              },
            ],
            order: 999,
            title: "Modes",
          },
        ],
      },
    ]);
  });

  test("Generates breadcrumbs for deeply nested groups", () => {
    expect(
      transformNavGroups([
        {
          title: "Storybook",
          items: [
            {
              id: "storybook",
              collection: "troubleshooting",
              data: {
                title: "Setup",
                description: "Setup",
                sidebar: {
                  label: "Setup",
                  order: 1,
                  hide: false,
                },
              },
            },
            {
              title: "Modes",
              items: [
                {
                  id: "modes",
                  collection: "modes",
                  data: {
                    title: "Story Modes",
                    description: "Story Modes",
                    sidebar: {
                      label: "Story Modes",
                      order: 1,
                      hide: false,
                    },
                  },
                },
                {
                  title: "Something",
                  items: [
                    {
                      id: "interactions",
                      collection: "troubleshooting",
                      data: {
                        title: "Interaction tests",
                        description: "Interaction tests",
                        sidebar: {
                          label: "Interaction tests",
                          order: 2,
                          hide: false,
                        },
                      },
                    },
                    {
                      id: "storybook/publish",
                      collection: "troubleshooting",
                      data: {
                        title: "Publish",
                        description: "Publish",
                        sidebar: {
                          label: "Publish",
                          order: 3,
                          hide: false,
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]),
    ).toEqual([
      {
        title: "Storybook",
        items: [
          {
            hide: false,
            label: "Setup",
            order: 1,
            id: "storybook",
            isHome: false,
            breadcrumb: "Storybook",
          },
          {
            hide: false,
            items: [
              {
                hide: false,
                label: "Story Modes",
                order: 1,
                id: "modes",
                isHome: false,
                breadcrumb: "Storybook » Modes",
              },
              {
                hide: false,
                items: [
                  {
                    hide: false,
                    isHome: false,
                    label: "Interaction tests",
                    order: 2,
                    id: "interactions",
                    breadcrumb: "Storybook » Modes » Something",
                  },
                  {
                    hide: false,
                    isHome: false,
                    label: "Publish",
                    order: 3,
                    id: "storybook/publish",
                    breadcrumb: "Storybook » Modes » Something",
                  },
                ],
                order: 999,
                title: "Something",
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

describe("flattenNavGroups", () => {
  test("Flattens nested groups", () => {
    expect(
      flattenGroups([
        {
          title: "Storybook",
          items: [
            {
              hide: false,
              label: "Setup",
              order: 1,
              id: "storybook",
              isHome: false,
              breadcrumb: "Storybook",
            },
            {
              hide: false,
              items: [
                {
                  hide: false,
                  label: "Story Modes",
                  order: 1,
                  id: "modes",
                  isHome: false,
                  breadcrumb: "Storybook » Modes",
                },
                {
                  hide: false,
                  items: [
                    {
                      hide: false,
                      isHome: false,
                      label: "Interaction tests",
                      order: 2,
                      id: "interactions",
                      breadcrumb: "Storybook » Modes » Something",
                    },
                    {
                      hide: false,
                      isHome: false,
                      label: "Publish",
                      order: 3,
                      id: "storybook/publish",
                      breadcrumb: "Storybook » Modes » Something",
                    },
                  ],
                  order: 999,
                  title: "Something",
                },
              ],
              order: 999,
              title: "Modes",
            },
          ],
        },
      ]),
    ).toEqual([
      {
        hide: false,
        label: "Setup",
        order: 1,
        id: "storybook",
        isHome: false,
        breadcrumb: "Storybook",
      },
      {
        hide: false,
        label: "Story Modes",
        order: 1,
        id: "modes",
        isHome: false,
        breadcrumb: "Storybook » Modes",
      },
      {
        hide: false,
        isHome: false,
        label: "Interaction tests",
        order: 2,
        id: "interactions",
        breadcrumb: "Storybook » Modes » Something",
      },
      {
        hide: false,
        isHome: false,
        label: "Publish",
        order: 3,
        id: "storybook/publish",
        breadcrumb: "Storybook » Modes » Something",
      },
    ]);
  });
});
