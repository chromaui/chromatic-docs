import {
  color,
  fontFamily,
  HStack,
  spacing,
  Text,
  typography,
  VStack,
} from "@chromatic-com/tetra";
import { styled } from "@storybook/theming";
import type { ConfigOption as ConfigOptionType } from "../../chromatic-config/generate-schema";

const Name = styled.h3`
  ${typography.heading18}
  font-family: ${fontFamily.mono};
  color: ${color.slate800};
  && {
    margin: 0;
  }
`;
const Flag = styled.code`
  ${typography.body14}
  font-family: ${fontFamily.mono};
  color: ${color.slate800};
`;
const Description = styled.div``;
const Code = styled.code`
  ${typography.body14}
  font-family: ${fontFamily.mono};
  background: ${color.slate100};
  color: ${color.slate800};
  padding: ${spacing[0.5]} ${spacing[1]};

  padding: 3px 5px;
  display: inline-block;
  vertical-align: baseline;
  line-height: 1;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;
const ExampleValue = styled.div``;

const formatOption = ({ option, flag, shortFlag, restriction }: any) => {
  const lead = option ? option : `<code>${flag}</code>`;
  const hasBoth = option && flag;

  return [
    `<strong>${lead}</strong>`,
    restriction ? ` (${restriction})` : "",
    hasBoth ? "<br/>" : "",
    hasBoth && flag ? `<code>${flag}</code>` : "",
    shortFlag ? ` (<code>${shortFlag}</code>)` : "",
  ].join("");
};

const FormattedType = ({ value }: { value: string | string[] }) => {
  if (value === "array of glob") {
    return (
      <>
        {/* <Value>glob</Value> or array of <Value>glob</Value> */}
        <Code>string | string[]</Code> (glob)
      </>
    );
  }

  if (Array.isArray(value)) {
    return (
      <Code>
        {value.map((t, idx) => {
          return (
            <>
              {t}
              {idx < value.length - 1 && " | "}
            </>
          );
        })}
      </Code>
    );
  }

  return <Code>{value}</Code>;
};

function formatDefault(comment?: string, value?: string | boolean) {
  if (comment) {
    return comment;
  }

  if (value !== undefined) {
    return `<code>${value}</code>`;
  }
}

export const ConfigOption = ({
  option,
  flag,
  description,
  type,
  example,
  inConfigFileSchema,
  deprecated,
  default: defaultValue,
}: ConfigOptionType) => {
  return (
    <VStack gap={3} marginTop={6} marginBottom={6}>
      <Name>{option}</Name>
      <Flag>{flag}</Flag>
      <HStack align="center">
        <Text fontWeight="bold" variant="body14">
          Type:
        </Text>
        <FormattedType value={type} />
      </HStack>
      {defaultValue && (
        <div>
          <Text fontWeight="bold" variant="body14">
            Default:
          </Text>
          <Code>{defaultValue?.toString()}</Code>
        </div>
      )}
      <Description dangerouslySetInnerHTML={{ __html: description }} />
      {example && (
        <HStack align="center">
          <Text fontWeight="bold" variant="body14">
            Example:
          </Text>
          <ExampleValue dangerouslySetInnerHTML={{ __html: example }} />
        </HStack>
      )}
    </VStack>
  );
};
