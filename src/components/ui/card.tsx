import { Card } from "antd";
import type { ReactNode } from "react";

const Cards = ({ children }: { children: ReactNode }) => {
  return (
    <Card
      className={`h-[200px] shadow-sm shadow-blue-200`}
      style={{ padding: "5px" }}
    >
      {children}
    </Card>
  );
};

export default Cards;
