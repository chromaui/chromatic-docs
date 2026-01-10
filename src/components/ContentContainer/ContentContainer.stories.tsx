import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContentContainer } from "./ContentContainer";

const meta = {
  title: "Components/ContentContainer",
  component: ContentContainer,
  // ContentContainer is already loaded for all stories in .storybook/preview.tsx
  render: ({ children }) => <div style={{ maxWidth: 796 }}>{children}</div>,
} satisfies Meta<typeof ContentContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const Heading = ({
  level = 2,
  children,
}: {
  level?: number;
  children: React.ReactNode;
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag>
      {children}
      <a
        className="autolink-header"
        aria-hidden="true"
        tabIndex={-1}
        href="#some-auto-generate-slug"
      >
        <svg
          className="autolink-svg"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="currentColor"
          viewBox="0 0 14 14"
          aria-label="Link to this section"
        >
          <path d="M11.841 2.159a2.25 2.25 0 0 0-3.182 0l-2.5 2.5a2.25 2.25 0 0 0 0 3.182.5.5 0 0 1-.707.707 3.25 3.25 0 0 1 0-4.596l2.5-2.5a3.25 3.25 0 0 1 4.596 4.596l-2.063 2.063a4.27 4.27 0 0 0-.094-1.32l1.45-1.45a2.25 2.25 0 0 0 0-3.182Z"></path>
          <path d="M3.61 7.21c-.1-.434-.132-.88-.095-1.321L1.452 7.952a3.25 3.25 0 1 0 4.596 4.596l2.5-2.5a3.25 3.25 0 0 0 0-4.596.5.5 0 0 0-.707.707 2.25 2.25 0 0 1 0 3.182l-2.5 2.5A2.25 2.25 0 1 1 2.159 8.66l1.45-1.45Z"></path>
        </svg>
      </a>
    </Tag>
  );
};

const CodeExample = () => (
  <pre
    className="astro-code github-light"
    style={{
      backgroundColor: "#fff",
      color: "#24292e",
      overflowX: "auto",
    }}
    tabIndex={0}
    data-language="bash"
  >
    <code>
      <span className="line">
        <span style={{ color: "#6A737D" }}># Install Chromatic</span>
      </span>
      {"\n"}
      <span className="line">
        <span style={{ color: "#6F42C1" }}>$</span>
        <span style={{ color: "#032F62" }}> npm</span>
        <span style={{ color: "#032F62" }}> install</span>
        <span style={{ color: "#005CC5" }}> --save-dev</span>
        <span style={{ color: "#032F62" }}> chromatic</span>
      </span>
      {"\n"}
      <span className="line" />
      {"\n"}
      <span className="line">
        <span style={{ color: "#6A737D" }}>
          # Use your project token and run the following command
        </span>
      </span>
      {"\n"}
      <span className="line">
        <span style={{ color: "#6A737D" }}># in your project directory</span>
      </span>
      {"\n"}
      <span className="line">
        <span style={{ color: "#6F42C1" }}>$</span>
        <span style={{ color: "#032F62" }}> npx</span>
        <span style={{ color: "#032F62" }}> chromatic</span>
        <span style={{ color: "#005CC5" }}> --project-token</span>
        <span style={{ color: "#D73A49" }}> &lt;</span>
        <span style={{ color: "#032F62" }}>YOUR_PROJECT_TOKE</span>
        <span style={{ color: "#24292E" }}>N</span>
        <span style={{ color: "#D73A49" }}>&gt;</span>
      </span>
      {"\n"}
      <span className="line" />
    </code>
  </pre>
);

export const Headings: Story = {
  args: {
    children: (
      <>
        <Heading level={1}>Configuration reference</Heading>
        <Heading level={2}>Configuration reference</Heading>
        <Heading level={3}>Configuration reference</Heading>
        <Heading level={4}>Configuration reference</Heading>
        <Heading level={5}>Configuration reference</Heading>
        <Heading level={6}>Configuration reference</Heading>
      </>
    ),
  },
};

export const Basic: Story = {
  args: {
    children: (
      <>
        <Heading level={1}>Configuration reference</Heading>
        <p>
          These options control how Chromatic behaves. See also{" "}
          <a href="/docs/branching-and-baselines">
            <strong>branching docs</strong>
          </a>{" "}
          and <a href="#diagnosing-issues">diagnosing issues</a> for when to use
          some of these flags. Some options are only available as a flag or as
          an input to the GitHub Action.
        </p>
        <p>
          Flags must be passed as <code>--kebab-case</code> whereas options are{" "}
          <code>camelCase</code>. Flags take precedence over configuration
          options. When passing a flag without value, it is treated as true.
          Where an array is accepted, specify the flag multiple times (once for
          each value).
        </p>
      </>
    ),
  },
};

export const OrderedList: Story = {
  args: {
    children: (
      <>
        <Heading>How does visual testing work?</Heading>
        <p>Chromatic’s streamlined workflow involves four steps:</p>
        <ol>
          <li>
            <strong>Cloud Rendering:</strong> Chromatic renders your UI
            components in a cloud-based browser.
          </li>
          <li>
            <strong>Snapshot Capture:</strong> Chromatic takes a snapshot for
            each test, with all tests running simultaneously to save you time.
          </li>
          <li>
            <strong>Automated diffing:</strong> Whenever you update your code,
            Chromatic generates new snapshots and compares them to the
            baselines.
          </li>
          <li>
            <strong>Review and Verification:</strong> When Chromatic detects
            changes, you’re prompted to review them to ensure they’re
            intentional. Any unexpected changes trigger notifications so you can
            fix them quickly.
          </li>
        </ol>
      </>
    ),
  },
};

export const UnOrderedList: Story = {
  args: {
    children: (
      <>
        <p>
          Chromatic manages the entire testing process for you. Everything from
          building and publishing your Storybook to running tests in cloud
          browsers.
        </p>
        <p>
          Publish Storybook Key advantages of Chromatic’s Storybook integration:
        </p>
        <ul>
          <li>
            <strong>Story-driven testing:</strong> Eliminate the hassle of
            writing separate tests. Chromatic automatically converts your
            stories into visual tests.
          </li>
          <li>
            <a href="/docs/interactions/#interaction-tests">
              <strong>Zero-config interaction tests:</strong>
            </a>{" "}
            If you use Storybook’s{" "}
            <a href="https://storybook.js.org/docs/writing-stories/play-function">
              play functions
            </a>{" "}
            for functional testing, Chromatic intelligently waits for their
            completion before capturing snapshots.
          </li>
          <li>
            <strong>Parallelized testing:</strong> Chromatic’s cloud
            infrastructure is optimized to test all your stories simultaneously
            at no extra cost, maximizing speed and efficiency.
          </li>
          <li>
            <strong>Cross-browser testing:</strong> Chromatic’s coverage extends
            to Chrome, Firefox, Safari, and Edge. All browser tests run in
            parallel.
          </li>
          <li>
            <a href="/docs/modes/">
              <strong>Effortless variant testing:</strong>
            </a>{" "}
            Chromatic harnesses the power of{" "}
            <a href="https://storybook.js.org/docs/essentials/toolbars-and-globals#globals">
              Storybook Globals
            </a>{" "}
            to comprehensively test UI variations across themes, viewports,
            locales, and media features.
          </li>
        </ul>
      </>
    ),
  },
};

export const Video: Story = {
  args: {
    children: (
      <>
        <Heading>How does visual testing work?</Heading>
        <p>
          You can think of Chromatic’s visual testing as “before-and-after”{" "}
          <a href="/docs/snapshots">snapshots</a> of your app’s interface. You
          begin by capturing a perfect “before” image—this becomes your{" "}
          <a href="/docs/branching-and-baselines#whats-a-baseline">baseline</a>.
          After any code changes, Chromatic compares a new “after” snapshot
          pixel-by-pixel against the baseline, revealing any visual differences.
        </p>
        <p>
          You can think of Chromatic’s visual testing as “before-and-after”{" "}
          <a href="/docs/snapshots">snapshots</a> of your app’s interface. You
          begin by capturing a perfect “before” image—this becomes your{" "}
          <a href="/docs/branching-and-baselines#whats-a-baseline">baseline</a>.
          After any code changes, Chromatic compares a new “after” snapshot
          pixel-by-pixel against the baseline, revealing any visual differences.
        </p>
        <video
          autoPlay
          muted
          playsInline
          loop
          style={{
            marginBottom: "1em",
            border: "1px solid rgba(0, 0, 0, 0.1);",
          }}
        >
          <source src="/assets/visual-test-hero.mp4" type="video/mp4" />
        </video>
      </>
    ),
  },
};

export const Images: Story = {
  args: {
    children: (
      <>
        <Heading>
          <img
            src="/assets/storybook.svg"
            style={{ alignSelf: "center" }}
            className="inline-icon"
            alt=""
          />{" "}
          Visual testing with Storybook
        </Heading>
        <p>
          <a href="https://storybook.js.org">Storybook</a> is an open source
          workshop for developing components and pages in isolation. Chromatic
          is built and maintained by the team behind Storybook, ensuring a
          seamless integration.
        </p>
        <p>
          Storybook lets you define the different states and variations of
          components as{" "}
          <a href="https://storybook.js.org/docs/get-started/whats-a-story">
            stories
          </a>
          . This gives you an ideal setup for functional testing. Attach a{" "}
          <a href="https://storybook.js.org/docs/writing-stories/play-function">
            play function
          </a>{" "}
          to mimic how users interact with your components and include
          assertions to verify the expected behavior. Chromatic uses these
          stories to power visual tests.
        </p>
        <p>
          <img
            src="/workflow-addon.png"
            alt=""
            width={2120}
            height={1026}
            loading="lazy"
            decoding="async"
          />
        </p>
      </>
    ),
  },
};

export const Aside: Story = {
  args: {
    children: (
      <div className="aside">
        We recommend saving the project token as a secret environment variable
        named <code>CHROMATIC_PROJECT_TOKEN</code> for security reasons. In your
        Azure pipeline configuration, forward it using the `env` option. When
        the Chromatic CLI is executed, it will read the environment variable
        automatically without any additional flags. Refer to the official Azure{" "}
        <a href="https://learn.microsoft.com/en-us/azure/devops/pipelines/process/set-secret-variables?view=azure-devops&tabs=yaml%2Cbash">
          environment variables documentation
        </a>{" "}
        to learn more about it.
      </div>
    ),
  },
};

export const Callout: Story = {
  args: {
    children: (
      <div className="callout">
        ℹ️ The <code>chromatic.delay</code> parameter can be set at story,
        component, and project levels. This enables you to set project wide
        defaults and override them for specific components and/or stories.{" "}
        <a href="/docs/config-with-story-params">Learn more »</a>
      </div>
    ),
  },
};

export const Code: Story = {
  args: {
    children: <CodeExample />,
  },
};

export const CodeWithAside: Story = {
  args: {
    children: (
      <>
        <CodeExample />
        {Aside.args?.children}
      </>
    ),
  },
};

export const CodeWithCallout: Story = {
  args: {
    children: (
      <>
        {Callout.args?.children}
        <CodeExample />
      </>
    ),
  },
};

export const Disclosure: Story = {
  args: {
    children: (
      <details open>
        <summary id="setup-gitignore-to-ignore-certain-files-in-your-git-repository">
          Setup .gitignore to ignore certain files in your Git repository
        </summary>
        <p>
          Running the Chromatic command may generate certain files for logging
          and debugging purposes. Exactly which files it generates depends on
          your configuration, but these entries should likely be added to your{" "}
          <code>.gitignore</code> file:
        </p>
        <pre
          className="astro-code github-light"
          style={{
            backgroundColor: "#fff",
            color: "#24292e",
            overflowX: "auto",
          }}
          tabIndex={0}
          data-language="plaintext"
        >
          <code>
            <span className="line">
              <span>build-storybook.log</span>
            </span>
            {"\n"}
            <span className="line">
              <span>chromatic.log</span>
            </span>
            {"\n"}
            <span className="line">
              <span>chromatic-build-*.xml</span>
            </span>
            {"\n"}
            <span className="line">
              <span>chromatic-diagnostics.json</span>
            </span>
            {"\n"}
            <span className="line">
              <span />
            </span>
          </code>
        </pre>
      </details>
    ),
  },
};
