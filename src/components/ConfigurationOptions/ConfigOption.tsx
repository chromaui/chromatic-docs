import React from "react";
import {
  color,
  fontFamily,
  fontSize,
  HStack,
  spacing,
  Text,
  VStack,
} from "@chromatic-com/tetra";
import { styled } from "@storybook/theming";
import type {
  ConfigOption as ConfigOptionType,
  SupportedType,
} from "../../../chromatic-config/generate-schema";

const Name = styled.h3`
  font-family: ${fontFamily.mono};
  color: ${color.slate800};
  && {
    margin: 0 0 ${spacing[1]} 0;
  }

  & > a.anchorjs-link {
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

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

const ConfigOptionContainer = styled(VStack)`
  margin-top: ${spacing[12]};
  margin-bottom: ${spacing[12]};
`;

const Item = styled(HStack)``;

const Tag = styled.div<{ type: SupportedType }>`
  padding: ${spacing[1]} ${spacing[2]};
  font-size: ${fontSize[14]};
  font-family: ${fontFamily.mono};
  line-height: 1;
  border-radius: 4px;
  color: ${({ type }) => {
    if (type === "Github Action") {
      return color.green600;
    } else if (type === "CLI") {
      return color.blue600;
    }

    return color.purple600;
  }};
  background-color: ${({ type }) => {
    if (type === "Github Action") {
      return color.green100;
    } else if (type === "CLI") {
      return color.blue100;
    }

    return color.purple100;
  }};
`;

export interface ConfigOptionProps extends ConfigOptionType {
  supports: SupportedType[];
}

export const ConfigOption = ({
  option,
  shortFlag,
  flag,
  description,
  type,
  example,
  supports,
  default: defaultValue,
}: ConfigOptionProps) => {
  return (
    <ConfigOptionContainer gap={4} align="flex-start">
      <VStack gap={1} marginBottom={2}>
        <Name className="config-option">{option}</Name>
        <HStack align="center" gap={2}>
          {supports.map((type) => (
            <Tag key={type} type={type}>
              {type}
            </Tag>
          ))}
        </HStack>
      </VStack>
      <VStack gap={1} style={{ width: "100%" }}>
        {flag && (
          <HStack align="center">
            <Text fontWeight="bold" variant="body16">
              Flag:
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
        )}
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
        <Item align="center">
          <Text fontWeight="bold" variant="body16">
            Example:
          </Text>
          <div dangerouslySetInnerHTML={{ __html: example }} />
        </Item>
      </VStack>
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </ConfigOptionContainer>
  );
};
