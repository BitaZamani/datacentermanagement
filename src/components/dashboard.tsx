import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../slices/store";
import { useEffect } from "react";
import { getCounts } from "../slices/staticsSlice";
import { Spin } from "antd";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import Cards from "./ui/card";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const dcCount = useSelector(
    (state: RootState) => state.statics.dataCentersCount
  );
  const rCount = useSelector((state: RootState) => state.statics.racksCount);
  const loading = useSelector((state: RootState) => state.statics.loading);
  useEffect(() => {
    if (!rCount || !dcCount) dispatch(getCounts());
  }, [dispatch, rCount, dcCount]);
  const data = [
    {
      name: "مرکز داده",
      uv: dcCount,
    },
    {
      name: "رک",
      uv: rCount,
    },
  ];
  return (
    <div className="p-2 flex justify-center items-center w-full">
      {loading ? (
        <Spin />
      ) : (
        <div className="w-full grid md:grid-cols-2 gap-3">
          <Cards>
            <div className="flex flex-col justify-center items-center gap-5">
              <span className="font-bold text-xl md:text-2xl">
                {user.name} عزیز، خوش آمدید.
              </span>
              <span>{new Date().toLocaleDateString("fa-IR")}</span>
            </div>
          </Cards>
          <Cards>
            <span>تعداد مراکز داده و رک‌ها</span>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart width={150} height={100} data={data}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Bar dataKey="uv" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Cards>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
