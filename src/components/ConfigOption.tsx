import React from "react";
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
    margin: 0 0 ${spacing[1]} 0;
  }
`;

const Description = styled.div``;

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
        <code>string | string[]</code>{" "}
        <Text as="span" variant="body14">
          (glob)
        </Text>
      </>
    );
  }

  if (Array.isArray(value)) {
    return (
      <code>
        {value.map((t, idx) => {
          return (
            <React.Fragment key={t}>
              {t}
              {idx < value.length - 1 && " | "}
            </React.Fragment>
          );
        })}
      </code>
    );
  }

  return <code>{value}</code>;
};

function formatDefault(comment?: string, value?: string | boolean) {
  if (comment) {
    return comment;
  }

  if (value !== undefined) {
    return `<code>${value}</code>`;
  }
}

const ConfigOptionContainer = styled(VStack)`
  max-width: 512px;
  margin-top: ${spacing[6]};
  margin-bottom: ${spacing[6]};
`;

const Item = styled(HStack)`
  width: 60%;
`;

export const ConfigOption = ({
  option,
  shortFlag,
  flag,
  description,
  type,
  example,
  inConfigFileSchema,
  deprecated,
  default: defaultValue,
}: ConfigOptionType) => {
  return (
    <ConfigOptionContainer gap={4} align="flex-start">
      <Name>{option}</Name>
      <VStack gap={1} style={{ width: "100%" }}>
        <HStack align="center">
          <Text fontWeight="bold" variant="body16">
            CLI:
          </Text>
          <div>
            <code>{flag}</code>{" "}
            {shortFlag && (
              <>
                (<code>{shortFlag}</code>)
              </>
            )}
          </div>
        </HStack>
        <HStack align="center">
          <Text fontWeight="bold" variant="body16">
            Type:
          </Text>
          <FormattedType value={type} />
        </HStack>
        {defaultValue && (
          <HStack align="center">
            <Text fontWeight="bold" variant="body16">
              Default:
            </Text>
            <div dangerouslySetInnerHTML={{ __html: defaultValue }} />
          </HStack>
        )}
        {example && (
          <Item align="center">
            <Text fontWeight="bold" variant="body16">
              Example:
            </Text>
            <div dangerouslySetInnerHTML={{ __html: example }} />
          </Item>
        )}
      </VStack>
      <Description dangerouslySetInnerHTML={{ __html: description }} />
    </ConfigOptionContainer>
  );
};
