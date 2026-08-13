import React from 'react';
import { color, fontFamily, fontSize, HStack, spacing, Text, VStack } from '@chromatic-com/tetra';
import styled from '@emotion/styled';
import type {
  ConfigOption as ConfigOptionType,
  SupportedType,
} from '../../../chromatic-config/generate-schema';
import { optionSlug } from './optionSlug';

const Name = styled.h3`
  font-family: ${fontFamily.mono};
  color: ${color.slate800};
  && {
    margin: 0 0 ${spacing[1]} 0;
  }
`;

/**
 * Mirrors the markup rehype-autolink-headings generates for Markdown headings, so option headings
 * pick up the same hover-reveal anchor styling from `src/styles/formatting.ts`.
 */
const AutolinkHeader = ({ slug }: { slug: string }) => (
  <a className="autolink-header" aria-hidden="true" tabIndex={-1} href={`#${slug}`}>
    <svg
      className="autolink-svg"
      xmlns="http://www.w3.org/2000/svg"
      width={14}
      height={14}
      fill="currentColor"
      viewBox="0 0 14 14"
      aria-label="Link to this section"
    >
      <path d="M11.841 2.159a2.25 2.25 0 0 0-3.182 0l-2.5 2.5a2.25 2.25 0 0 0 0 3.182.5.5 0 0 1-.707.707 3.25 3.25 0 0 1 0-4.596l2.5-2.5a3.25 3.25 0 0 1 4.596 4.596l-2.063 2.063a4.27 4.27 0 0 0-.094-1.32l1.45-1.45a2.25 2.25 0 0 0 0-3.182Z" />
      <path d="M3.61 7.21c-.1-.434-.132-.88-.095-1.321L1.452 7.952a3.25 3.25 0 1 0 4.596 4.596l2.5-2.5a3.25 3.25 0 0 0 0-4.596.5.5 0 0 0-.707.707 2.25 2.25 0 0 1 0 3.182l-2.5 2.5A2.25 2.25 0 1 1 2.159 8.66l1.45-1.45Z" />
    </svg>
  </a>
);

const FormattedType = ({ value }: { value: string | string[] }) => {
  if (value === 'array of glob') {
    return (
      <>
        <code>string | string[]</code>{' '}
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
              {idx < value.length - 1 && ' | '}
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
    if (type === 'GitHub Action') {
      return color.green600;
    } else if (type === 'CLI') {
      return color.blue600;
    }

    return color.purple600;
  }};
  background-color: ${({ type }) => {
    if (type === 'GitHub Action') {
      return color.green100;
    } else if (type === 'CLI') {
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
  const slug = optionSlug(option);

  return (
    <ConfigOptionContainer gap={4} align="flex-start">
      <VStack gap={1} marginBottom={2}>
        <Name className="config-option" id={slug || undefined}>
          {option}
          {slug && <AutolinkHeader slug={slug} />}
        </Name>
        <HStack align="center" gap={2}>
          {supports.map((type) => (
            <Tag key={type} type={type}>
              {type}
            </Tag>
          ))}
        </HStack>
      </VStack>
      <VStack gap={1} style={{ width: '100%' }}>
        {flag && (
          <HStack align="center">
            <Text fontWeight="bold" variant="body16">
              Flag:
            </Text>
            <div>
              <code>{flag}</code>{' '}
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
