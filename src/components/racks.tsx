import { Button, Modal, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../slices/store";
import { useEffect } from "react";
import { deleteRack, getRacks, setRack } from "../slices/dbSlice";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import RackModal from "./rackModal";
import { setOpenRackModal } from "../slices/interactionSlice";
import type { RackType } from "../types/types";
import SkeletonLoader from "./ui/skeleton";

const Racks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.db.loading);
  const error = useSelector((state: RootState) => state.db.error);
  const racks = useSelector((state: RootState) => state.db.racks);
  const openRackModal = useSelector(
    (state: RootState) => state.interaction.openRackModal
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
      title: "مرکز داده",
      dataIndex: "dataCenterName",
      key: "dataCenterName",
    },
    {
      title: "توضیحات",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "عملیات",

      key: "action",
      render: (rack: RackType) => (
        <div className="flex gap-3">
          <EditFilled
            onClick={() => {
              dispatch(setRack(rack));
              dispatch(setOpenRackModal(true));
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
                onOk: () => dispatch(deleteRack(rack)),
              })
            }
          />
        </div>
      ),
    },
  ];
  useEffect(() => {
    if (!racks.length) dispatch(getRacks()).unwrap();
  }, [dispatch, racks.length]);
  if (loading) return <SkeletonLoader />;
  return (
    <div className="p-2">
      <h2 className="font-semibold text-lg text-center md:text-xl">رک‌ها</h2>
      <Button onClick={() => dispatch(setOpenRackModal(true))} className="my-2">
        افزودن رک جدید
      </Button>
      {error ? (
        <span>{error}</span>
      ) : (
        <Table columns={cols} dataSource={racks} className="overflow-scroll" />
      )}
      {openRackModal && <RackModal />}
    </div>
  );
};

export default Racks;
