import { Button, fontWeight, spacing } from "@chromaui/tetra";
import { styled } from "@storybook/theming";

const Trigger = styled(Button)`
  align-self: flex-start;
  width: ${spacing[48]};
  flex: none;
  font-weight: ${fontWeight.bold};
`;

export function Support() {
  const openIntercom = () => {
    // @ts-ignore
    const { Intercom } = window;
    console.log(Intercom);
    if (Intercom) {
      Intercom("showNewMessage");
    }
  };

  return (
    <Trigger variant="outline" color="slate" size="sm" onClick={openIntercom}>
      Get support
    </Trigger>
  );
}
