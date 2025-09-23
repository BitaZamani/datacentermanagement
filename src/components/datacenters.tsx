import { Button, Modal, Table } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../slices/store";
import {
  deleteDataCenter,
  getDataCenters,
  setDataCenter,
} from "../slices/dbSlice";
import { setOpenDataCenterModal } from "../slices/interactionSlice";
import DataCenterModal from "./dataCenterModal";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import type { DataCenterType } from "../types/types";
import SkeletonLoader from "./ui/skeleton";

const Datacenters = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.db.loading);
  const error = useSelector((state: RootState) => state.db.error);
  const dataCenters = useSelector((state: RootState) => state.db.dataCenters);
  const openDataCenter = useSelector(
    (state: RootState) => state.interaction.openDataCenterModal
  );
  const cols = [
    {
      title: "شناسه",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "عنوان",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "توضیحات",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "عملیات",

      key: "action",
      render: (dataCenter: DataCenterType) => (
        <div className="flex gap-3">
          <EditFilled
            onClick={() => {
              dispatch(setDataCenter(dataCenter));
              dispatch(setOpenDataCenterModal(true));
            }}
          />
          <DeleteFilled
            onClick={() =>
              Modal.confirm({
                title: "حذف مرکز داده",
                content:
                  "در صورت حذف این مرکز داده، تمامی رک‌های زیرمجموعه نیز حذف می‌شوند.",
                okText: "حذف",
                cancelText: "لغو",
                onOk: () => dispatch(deleteDataCenter(dataCenter)),
              })
            }
          />
        </div>
      ),
    },
  ];
  useEffect(() => {
    if (!dataCenters.length) dispatch(getDataCenters()).unwrap();
  }, [dispatch, dataCenters.length]);
  if (loading) return <SkeletonLoader />;
  return (
    <div className="p-2">
      <h2 className="font-semibold text-lg text-center md:text-xl">
        مرکز داده‌ها
      </h2>
      <Button
        onClick={() => dispatch(setOpenDataCenterModal(true))}
        className="my-2"
      >
        افزودن مرکز داده جدید
      </Button>
      {error ? (
        <span>{error}</span>
      ) : (
        <Table columns={cols} dataSource={dataCenters} />
      )}
      {openDataCenter && <DataCenterModal />}
    </div>
  );
};

export default Datacenters;
