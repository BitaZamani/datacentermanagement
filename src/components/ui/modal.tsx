import { Modal } from "antd";
import type { ModalsProps } from "../../types/types";

const Modals = ({ children, open, okText, onCancel, form }: ModalsProps) => {
  return (
    <Modal
      centered
      open={open}
      okText={okText}
      cancelText="لغو"
      onCancel={onCancel}
      okButtonProps={{ form: form, htmlType: "submit" }}
    >
      {children}
    </Modal>
  );
};

export default Modals;
