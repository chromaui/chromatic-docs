import { validate } from "@hyperjump/json-schema/draft-2020-12";

async function runValidation(label, content) {
  const output = await validate(
    `./public/chromatic-config.schema.json`,
    content,
    "BASIC",
  );

  if (output.valid) {
    console.log(`✅ ${label} instance is valid`);
  } else {
    console.log(`
❌ ${label} Instance is invalid
`);
    console.log(output.errors);
  }
}

console.log("🚦 Validating schema for chromatic.config.json file");

runValidation("Minimal", {
  projectId: "Project:...",
});

runValidation("Unlinked project", {
  projectId: "Project:...",
  externals: ["public/**"],
  junitReport: true,
  onlyChanged: true,
});

runValidation("PR workflow", {
  projectId: "Project:...",
  autoAcceptChanges: "main",
  exitOnceUploaded: true,
  externals: ["public/**"],
  onlyChanged: true,
  skip: "dependabot/**",
});

runValidation("string-or-boolean type", {
  projectId: "Project:...",
  autoAcceptChanges: "main",
  exitOnceUploaded: true,
  externals: ["public/**"],
  onlyChanged: "my-folder/**",
  skip: "dependabot/**",
});

runValidation("Exhaustive", {
  projectId: "Project:...",
  onlyChanged: true,
  skip: "dependabot/**",
  onlyStoryFiles: ["src/ui/**"],
  onlyStoryNames: ["Atoms/Button/*"],
  traceChanged: false,
  untraced: ["my-folder/**"],
  externals: ["public/**"],
  debug: true,
  diagnosticsFile: false,
  fileHashing: true,
  junitReport: true,
  zip: true,
  autoAcceptChanges: "main",
  exitZeroOnChanges: "!(main)",
  exitOnceUploaded: true,
  ignoreLastBuildOnBranch: "my-branch",
  buildScriptName: "build:storybook",
  playwright: true,
  cypress: false,
  outputDir: "storybook-static",
  skipUpdateCheck: false,
  storybookBuildDir: "storybook-static",
  storybookBaseDir: "src/ui",
  storybookConfigDir: ".storybook",
  storybookLogFile: "sb.txt",
  logFile: "logs.txt",
  uploadMetadata: true,
});

runValidation("With deprecated projectToken", {
  projectId: "Project:...",
  projectToken: "xxxx",
  onlyChanged: true,
  skip: "dependabot/**",
  onlyStoryFiles: ["src/ui/**"],
  onlyStoryNames: ["Atoms/Button/*"],
  traceChanged: false,
  untraced: ["my-folder/**"],
  externals: ["public/**"],
  debug: true,
  diagnosticsFile: false,
  fileHashing: true,
  junitReport: true,
  zip: true,
  autoAcceptChanges: "main",
  exitZeroOnChanges: "!(main)",
  exitOnceUploaded: true,
  ignoreLastBuildOnBranch: "my-branch",
  buildScriptName: "build:storybook",
  playwright: true,
  cypress: false,
  outputDir: "storybook-static",
  skipUpdateCheck: false,
  storybookBuildDir: "storybook-static",
  storybookBaseDir: "src/ui",
  storybookConfigDir: ".storybook",
  storybookLogFile: "sb.txt",
  logFile: "logs.txt",
  uploadMetadata: true,
});

runValidation("With schema defined inline", {
  $schema: "https://www.chromatic.com/config-file.schema.json",
  projectId: "Project:...",
});
