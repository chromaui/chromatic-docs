import fs from "fs";
import { remark } from "remark";
import strip from "strip-markdown";
import configOptions from "./options.json" assert { type: "json" };

console.log("⚙️ Generating schema for chromatic.config.json file");

const stripMarkdown = (content) => {
  return remark()
    .use(strip)
    .processSync(content)
    .value.trimEnd()
    .replaceAll("\\", "");
};

const schemaDef = {
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
  properties: {},
};

const deprecatedOptions = ["projectToken"];

const types = {
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

const supportedOptions = [
  "projectId",
  "projectToken",
  "onlyChanged",
  "onlyStoryFiles",
  "onlyStoryNames",
  "traceChanged",
  "untraced",
  "externals",
  "debug",
  "diagnosticsFile",
  "fileHashing",
  "junitReport",
  "zip",
  "autoAcceptChanges",
  "exitZeroOnChanges",
  "exitOnceUploaded",
  "ignoreLastBuildOnBranch",
  "buildScriptName",
  "playwright",
  "cypress",
  "outputDir",
  "skip",
  "skipUpdateCheck",
  "storybookBuildDir",
  "storybookBaseDir",
  "storybookConfigDir",
  "storybookLogFile",
  "logFile",
  "uploadMetadata",
];

function getProperty(name) {
  return configOptions.find((option) => option.option === name);
}

for (const propertyName of supportedOptions) {
  const prop = getProperty(propertyName);

  if (!prop) {
    throw new Error(
      `Property ${propertyName} not found in chromatic-config/options.json`,
    );
  } else {
    const isDeprecated = deprecatedOptions.includes(propertyName);

    const description = isDeprecated
      ? `DEPRECATED ${prop.description}`
      : prop.description;
    const plainTextDescription = await stripMarkdown(description);

    const propDef = {
      ...types[Array.isArray(prop.type) ? prop.type.join("-") : prop.type],
      ...(isDeprecated && { deprecated: true }),
      description: plainTextDescription,
      markdownDescription: description,
      ...(prop.default &&
        prop.default !== "" && {
          default: stripMarkdown(prop.default),
        }),
      $comment: "Created by John Doe",
    };

    schemaDef.properties[propertyName] = propDef;
  }

  fs.writeFileSync(
    "public/chromatic-config.schema.json",
    JSON.stringify(schemaDef, null, 2),
  );
}
