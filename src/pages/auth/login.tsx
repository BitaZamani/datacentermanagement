import { Button, Form } from "antd";
import Inputs from "../../components/ui/inputs";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../slices/store";
import { login } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";

import { notify } from "../../components/notify";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const user = useSelector((state: RootState) => state.auth.user);
  const error = useSelector((state: RootState) => state.auth.loginError);
  const navigate = useNavigate();

  const loginUser = (values: { email: string; password: string }) => {
    if (user.uid) {
      notify("error", "قبلا وارد شده‌اید.");
      return;
    }
    dispatch(login(values));
    if (!error) navigate("/panel");
  };
  return (
    <div className="h-screen flex justify-center items-center">
      <Form
        layout="vertical"
        onFinish={(values) => loginUser(values)}
        className="flex flex-col gap-3 justify-center items-center border-2 min-h-[450px] border-blue-400 rounded-xl w-10/12 max-w-md"
      >
        <h2 className="font-semibold text-xl">ورود به حساب کاربری</h2>
        <Inputs label="ایمیل" type="email" name="email" />
        <Inputs label="رمز عبور" type="password" name="password" />
        <Button
          htmlType="submit"
          className="w-[300px]"
          color="blue"
          variant="solid"
        >
          {loading ? "در حال بررسی مشخصات ..." : "ورود"}
        </Button>
        <span className="my-3">
          آیا حساب کاربری ندارید؟
          <span
            onClick={() => navigate("/register")}
            className="underline underline-offset-4 text-blue-700 cursor-pointer"
          >
            ثبت نام
          </span>
        </span>
      </Form>
    </div>
  );
};

export default Login;
