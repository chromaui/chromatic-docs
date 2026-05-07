import { Button, fontWeight, minMd, spacing } from "@chromatic-com/tetra";
import styled from "@emotion/styled";

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
  const openChat = () => {
    if (window.Plain?.isInitialized?.()) {
      window.Plain.open();
    }
  };

  return (
    <Trigger
      variant="outline"
      color="slate"
      size="sm"
      onClick={openChat}
      {...props}
    >
      Get support
    </Trigger>
  );
}
