import {
  color,
  fontFamily,
  fontWeight,
  HStack,
  spacing,
  Text,
  typography,
  VStack,
} from "@chromatic-com/tetra";
import { css, styled } from "@storybook/theming";
import type { ConfigOption as ConfigOptionType } from "../../chromatic-config/generate-schema";

// Option / Flag	Description	Type	Example value	Default value

// autoAcceptChanges
// --auto-accept-changes	If there are any changes to the build, automatically accept them. Only for given branch, if specified.	glob or boolean	"main" or true	false

const Name = styled.h3`
  ${typography.heading18}
  font-family: ${fontFamily.mono};
  color: ${color.slate800};
  && {
    margin: 0;
  }
`;
const Flag = styled.div`
  ${typography.body14}
  font-family: ${fontFamily.mono};
  color: ${color.slate800};
  /* background: ${color.slate100}; */
  /* padding: ${spacing[0.5]} ${spacing[2]}; */
`;
const Description = styled.div``;
const Value = styled.div`
  ${typography.body14}
  font-family: ${fontFamily.mono};
  background: ${color.slate100};
  color: ${color.slate800};
  padding: ${spacing[0.5]} ${spacing[1]};

  padding: 3px 5px;
  display: inline-block;
  vertical-align: baseline;
  line-height: 1;
  -webkit-text-size-adjust: 100%;
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
        <Value>glob</Value> or array of <Value>glob</Value>
      </>
    );
  }

  if (Array.isArray(value)) {
    return value.map((t, idx) => {
      return (
        <>
          <Value>{t}</Value>
          {idx < value.length - 1 && "or"}
        </>
      );
    });
  }

  return <Value>${value}</Value>;
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
  option = "autoAcceptChanges",
  flag = "--auto-accept-changes",
  description = "If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
  type = ["glob", "boolean"],
  example = "'main' or true",
  inConfigFileSchema,
  deprecated,
  default: defaultValue = false,
}: ConfigOptionType) => {
  return (
    <VStack gap={3} marginTop={6} marginBottom={6}>
      <Name>{option}</Name>
      <Flag>{flag}</Flag>
      {/* <HStack align="center">
        <Text fontWeight="bold" variant="body14">
          Flag:
        </Text>
      </HStack> */}
      <HStack align="center">
        <Text fontWeight="bold" variant="body14">
          Type:
        </Text>
        <FormattedType value={type} />
      </HStack>
      <HStack align="center">
        <Text fontWeight="bold" variant="body14">
          Default:
        </Text>
        <Value>{defaultValue.toString()}</Value>
      </HStack>
      <Description>{description}</Description>
      <HStack align="center">
        <Text fontWeight="bold" variant="body14">
          Example:
        </Text>
        <ExampleValue>{example}</ExampleValue>
      </HStack>
    </VStack>
  );
};
