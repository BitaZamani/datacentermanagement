import { Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setMenuKey } from "../slices/interactionSlice";
import {
  BarChartOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  PicCenterOutlined,
} from "@ant-design/icons";
import type { AppDispatch, RootState } from "../slices/store";
import { useNavigate } from "react-router-dom";
import { logOut } from "../slices/authSlice";

const SideBar = () => {
  const items = [
    { key: "dashboard", label: "داشبورد", icon: <BarChartOutlined /> },
    { key: "datacenters", label: "مرکز داده", icon: <DatabaseOutlined /> },
    { key: "racks", label: "رک", icon: <PicCenterOutlined /> },
  ];
  const user = useSelector((state: RootState) => state.auth.user);
  const error = useSelector((state: RootState) => state.auth.logoutError);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const logOutUser = () => {
    dispatch(logOut());
    if (!error) navigate("/login");
  };
  return (
    <div>
      <div className="flex gap-4 items-center justify-center flex-col">
        <span>{user.name}</span>
        <span
          onClick={() => logOutUser()}
          className="gap-2 flex cursor-pointer"
        >
          <LogoutOutlined />
          خروج
        </span>
      </div>
      <Menu
        defaultSelectedKeys={["dashboard"]}
        items={items}
        onClick={(e) => dispatch(setMenuKey(e.key))}
      />
    </div>
  );
};

export default SideBar;
