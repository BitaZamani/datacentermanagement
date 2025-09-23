import { Button, Form } from "antd";
import Inputs from "../../components/ui/inputs";
import { register } from "../../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../slices/store";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const user = useSelector((state: RootState) => state.auth.user);
  const error = useSelector((state: RootState) => state.auth.registerError);
  const navigate = useNavigate();
  const registerUser = (values: {
    email: string;
    password: string;
    name: string;
  }) => {
    if (user.uid) {
      notify("error", "قبلا وارد شده‌اید.");
      return;
    }
    dispatch(register(values));
    if (!error) navigate("/panel");
  };
  return (
    <div className="h-screen flex justify-center items-center">
      <Form
        onFinish={(values) => registerUser(values)}
        layout="vertical"
        className="flex justify-center items-center flex-col border-2 border-blue-400 rounded-xl min-h-[450px] px-5 w-10/12 max-w-md"
      >
        <h2 className="font-semibold text-xl">ساخت حساب کاربری</h2>
        <Inputs label="نام و نام خانوادگی" type="text" name="name" />
        <Inputs label="ایمیل" type="email" name="email" />
        <Inputs label="رمز عبور" type="password" name="password" />
        <Button
          htmlType="submit"
          className="w-[80%] max-w-[300px]"
          color="blue"
          variant="solid"
        >
          {loading ? "در حال ایجاد حساب کاربری ..." : "ثبت نام"}
        </Button>
        <span className="my-3">
          آیا حساب کاربری دارید؟
          <span
            onClick={() => navigate("/")}
            className="underline underline-offset-4 text-blue-700 cursor-pointer"
          >
            ورود
          </span>
        </span>
      </Form>
    </div>
  );
};

export default Register;
