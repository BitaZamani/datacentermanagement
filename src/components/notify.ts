import { notification } from "antd";

type NotificationType = "success" | "error" | "info" | "warning";

export const notify = (type: NotificationType, description: string) => {
  notification[type]({
    message:
      type === "error"
        ? "خطا"
        : type === "success"
        ? "موفقیت"
        : type === "warning"
        ? "هشدار"
        : "اطلاع‌رسانی",
    description: description,
    placement: "topRight",
  });
};
