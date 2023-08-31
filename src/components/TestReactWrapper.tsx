import type { FC } from "react";

interface Props {
  children: React.ReactNode;
}

export const Wrapper: FC<Props> = ({ children }) => {
  return (
    <div>
      <div>Hello World</div>
      {children}
    </div>
  );
};
