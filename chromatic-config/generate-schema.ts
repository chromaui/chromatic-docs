import fs from "fs";
import { remark } from "remark";
import strip from "strip-markdown";
import RemarkLinkRewrite from "remark-link-rewrite";
import optionsJSON from "./options.json" assert { type: "json" };

export interface ConfigOption {
  option?: string;
  flag?: string;
  description: string;
  type: string | string[];
  example?: string;
  default?: string | boolean;
  inConfigFileSchema?: boolean;
  deprecated?: "config-file" | "all";
}

const propertyTypes = {
  "array of glob": {
    $ref: "#/$defs/array-of-strings",
  },
  boolean: {
    type: "boolean",
  },
  glob: {
    type: "string",
  },
  string: {
    type: "string",
  },
  "glob-boolean": {
    $ref: "#/$defs/string-or-boolean",
  },
  "string-boolean": {
    $ref: "#/$defs/string-or-boolean",
  },
};

type PropertyType = keyof typeof propertyTypes;

const stripMarkdown = (content: string) => {
  const value = String(remark().use(strip).processSync(content));
  return value.trimEnd().replaceAll("\\", "");
};

const formatDescription = async (
  description: string,
  isDeprecated?: boolean,
): Promise<string> => {
  const descWithDeprecated = isDeprecated
    ? `DEPRECATED ${description}`
    : description;

  const descWithAbsLinks = await remark()
    // @ts-ignore-next-line
    .use(RemarkLinkRewrite, {
      replacer: (url: string) => {
        if (url.startsWith("/docs/")) {
          return url.replace("/docs/", "https://www.chromatic.com/docs/");
        }
        return url;
      },
    })
    .process(descWithDeprecated);

  return String(descWithAbsLinks.value);
};

interface Schema {
  $schema: string;
  $id: string;
  additionalProperties: boolean;
  $defs: any;
  description: string;
  title: string;
  type: string;
  properties: any;
}

export async function createSchemaDef(configOptions: ConfigOption[]) {
  const schemaDef: Schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://chromatic.com/docs/chromatic-config.schema.json",
    additionalProperties: false,
    $defs: {
      "string-or-boolean": {
        anyOf: [{ type: "string" }, { type: "boolean" }],
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
    properties: {
      $schema: {
        type: "string",
        description:
          "The schema file (https://www.chromatic.com/docs/chromatic-config.schema.json)",
      },
    },
  };

  const supportedOptions: ConfigOption[] = (
    configOptions as ConfigOption[]
  ).filter((option) => option.inConfigFileSchema);

  for (const prop of supportedOptions) {
    if (prop.option) {
      const isDeprecated =
        prop.deprecated === "config-file" || prop.deprecated === "all";

      const description = await formatDescription(
        prop.description,
        isDeprecated,
      );
      const plainTextDescription = stripMarkdown(description);

      const type = (
        Array.isArray(prop.type) ? prop.type.join("-") : prop.type
      ) as PropertyType;

      const propDef = {
        ...propertyTypes[type],
        ...(isDeprecated && { deprecated: true }),
        description: plainTextDescription,
        markdownDescription: description,
        ...(prop.default &&
          prop.default !== "" && {
            default:
              typeof prop.default === "string"
                ? stripMarkdown(prop.default)
                : prop.default,
          }),
      };

      if (schemaDef.properties[prop.option]) {
        throw new Error(
          `Duplicate property found: ${prop.option}. Skipping property.`,
        );
      } else {
        schemaDef.properties[prop.option] = propDef;
      }
    }
  }

  return schemaDef;
}

export async function generateSchema() {
  console.log("⚙️ Generating schema for chromatic.config.json file");
  const schema = await createSchemaDef(optionsJSON as ConfigOption[]);

  fs.writeFileSync(
    "public/chromatic-config.schema.json",
    JSON.stringify(schema, null, 2),
  );
}
