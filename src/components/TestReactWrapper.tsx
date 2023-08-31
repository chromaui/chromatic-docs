import type { FC } from "react";
import { Button } from "@chromaui/tetra";

interface Props {
  children: React.ReactNode;
}

export const Wrapper: FC<Props> = ({ children }) => {
  return (
    <div>
      <div>Hello World</div>
      <Button>Hello You</Button>
      {children}
    </div>
  );
};
