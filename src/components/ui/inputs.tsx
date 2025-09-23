import { Form, Input } from "antd";
import type { InputProps } from "../../types/types";

const Inputs = ({ label, type, name }: InputProps) => {
  return (
    <Form.Item label={label} className="label" name={name}>
      {type === "password" ? (
        <Input.Password className="input" />
      ) : (
        <Input type={type} className="input" />
      )}
    </Form.Item>
  );
};

export default Inputs;
