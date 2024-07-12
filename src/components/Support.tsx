import { Button, fontWeight, minMd, spacing } from "@chromatic-com/tetra";
import { styled } from "@storybook/theming";

const Trigger = styled(Button)`
  align-self: flex-start;
  width: ${spacing[48]};
  flex: none;
  font-weight: ${fontWeight.bold};

  display: none;

  ${minMd} {
    display: block;
  }
`;

export function Support({ ...props }) {
  const openIntercom = () => {
    // @ts-ignore
    const { Intercom } = window;
    if (Intercom) {
      Intercom("showNewMessage");
    }
  };

  return (
    <Trigger
      variant="outline"
      color="slate"
      size="sm"
      onClick={openIntercom}
      {...props}
    >
      Get support
    </Trigger>
  );
}
