import { expect, test, describe } from "vitest";
import { createSchemaDef } from "./generate-schema";
import type { ConfigOption } from "./generate-schema";

const schemaBase = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://chromatic.com/docs/chromatic-config.schema.json",
  additionalProperties: false,
  $defs: {
    "string-or-boolean": {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "boolean",
        },
      ],
    },
    "array-of-strings": {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  description: "Configuration schema for visual testing tool Chromatic",
  title: "Chromatic Config File Schema",
  type: "object",
};

describe("Generate Schema", () => {
  test("Creates a schema", async () => {
    const options: ConfigOption[] = [
      {
        option: "autoAcceptChanges",
        flag: "--auto-accept-changes",
        description:
          "If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
        type: ["glob", "boolean"],
        example: '`"main"` or `true`',
        default: false,
        inConfigFileSchema: true,
      },
    ];

    const schema = await createSchemaDef(options);

    expect(schema).toEqual({
      ...schemaBase,
      properties: {
        $schema: {
          type: "string",
          description:
            "The schema file (https://www.chromatic.com/docs/chromatic-config.schema.json)",
        },
        autoAcceptChanges: {
          $ref: "#/$defs/string-or-boolean",
          description:
            "If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
          markdownDescription:
            "If there are any changes to the build, automatically accept them. Only for given branch, if specified.\n",
        },
      },
    });
  });

  test("Only includes props with inConfigFileSchema set to true", async () => {
    const options: ConfigOption[] = [
      {
        option: "autoAcceptChanges",
        flag: "--auto-accept-changes",
        description:
          "If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
        type: ["glob", "boolean"],
        example: '`"main"` or `true`',
        default: false,
        inConfigFileSchema: true,
      },
      {
        option: "projectId",
        description:
          "The unique identifier for your project, sometimes referred to as `appId`.",
        type: "string",
        example: '`"Project:5d67dc0374b2e300209c41e7"`',
      },
    ];

    const schema = await createSchemaDef(options);

    expect(schema).toEqual({
      ...schemaBase,
      properties: {
        $schema: {
          type: "string",
          description:
            "The schema file (https://www.chromatic.com/docs/chromatic-config.schema.json)",
        },
        autoAcceptChanges: {
          $ref: "#/$defs/string-or-boolean",
          description:
            "If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
          markdownDescription:
            "If there are any changes to the build, automatically accept them. Only for given branch, if specified.\n",
        },
      },
    });
  });

  test("Handles when prop is deprecated for config file", async () => {
    const options: ConfigOption[] = [
      {
        option: "autoAcceptChanges",
        flag: "--auto-accept-changes",
        description:
          "If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
        type: ["glob", "boolean"],
        example: '`"main"` or `true`',
        default: false,
        inConfigFileSchema: true,
        deprecated: "config-file",
      },
    ];

    const schema = await createSchemaDef(options);

    expect(schema).toEqual({
      ...schemaBase,
      properties: {
        $schema: {
          type: "string",
          description:
            "The schema file (https://www.chromatic.com/docs/chromatic-config.schema.json)",
        },
        autoAcceptChanges: {
          $ref: "#/$defs/string-or-boolean",
          deprecated: true,
          description:
            "DEPRECATED If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
          markdownDescription:
            "DEPRECATED If there are any changes to the build, automatically accept them. Only for given branch, if specified.\n",
        },
      },
    });
  });

  test("Handles when prop is deprecated everywhere", async () => {
    const options: ConfigOption[] = [
      {
        option: "autoAcceptChanges",
        flag: "--auto-accept-changes",
        description:
          "If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
        type: ["glob", "boolean"],
        example: '`"main"` or `true`',
        default: false,
        inConfigFileSchema: true,
        deprecated: "all",
      },
    ];

    const schema = await createSchemaDef(options);

    expect(schema).toEqual({
      ...schemaBase,
      properties: {
        $schema: {
          type: "string",
          description:
            "The schema file (https://www.chromatic.com/docs/chromatic-config.schema.json)",
        },
        autoAcceptChanges: {
          $ref: "#/$defs/string-or-boolean",
          deprecated: true,
          description:
            "DEPRECATED If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
          markdownDescription:
            "DEPRECATED If there are any changes to the build, automatically accept them. Only for given branch, if specified.\n",
        },
      },
    });
  });

  test("Makes relative links absolute", async () => {
    const options: ConfigOption[] = [
      {
        option: "autoAcceptChanges",
        description:
          "If there are any changes to the [build](/docs/build), automatically accept them. Only for given branch, if specified.",
        type: "string",
        inConfigFileSchema: true,
      },
    ];

    const schema = await createSchemaDef(options);

    expect(schema).toEqual({
      ...schemaBase,
      properties: {
        $schema: {
          type: "string",
          description:
            "The schema file (https://www.chromatic.com/docs/chromatic-config.schema.json)",
        },
        autoAcceptChanges: {
          description:
            "If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
          markdownDescription:
            "If there are any changes to the [build](https://www.chromatic.com/docs/build), automatically accept them. Only for given branch, if specified.\n",
          type: "string",
        },
      },
    });
  });
});
