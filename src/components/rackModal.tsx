import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../slices/store";
import { Form, Select } from "antd";
import Inputs from "./ui/inputs";
import Modals from "./ui/modal";
import { setOpenRackModal } from "../slices/interactionSlice";
import { saveRack } from "../slices/dbSlice";

const RackModal = () => {
  const rack = useSelector((state: RootState) => state.db.rack);
  const error = useSelector((state: RootState) => state.db.rackError);
  const dataCenters = useSelector((state: RootState) => state.db.dataCenters);
  const open = useSelector(
    (state: RootState) => state.interaction.openRackModal
  );
  const dispatch = useDispatch<AppDispatch>();
  const onCancel = () => {
    dispatch(setOpenRackModal(false));
  };
  const onFinish = (values: {
    name: string;
    description: string;
    dataCenterID: string;
  }) => {
    dispatch(
      saveRack({
        ...rack,
        name: values.name,
        description: values.description,
        dataCenterID: values.dataCenterID,
      })
    );
    if (!error) dispatch(setOpenRackModal(false));
  };
  return (
    <Modals open={open} okText={"افزودن"} onCancel={onCancel} form={"rackForm"}>
      <Form
        layout="vertical"
        id="rackForm"
        initialValues={{
          name: rack.name || "",
          description: rack.description || "",
          dataCenterID: rack.dataCenterID || "",
        }}
        onFinish={(values) => onFinish(values)}
      >
        <Inputs type="text" label="عنوان" name="name" />
        <Inputs type="text" label="توضیحات" name="description" />
        <Form.Item label="مرکز داده" name="dataCenterID">
          <Select
            className="input"
            options={dataCenters.map((datacenter) => ({
              label: datacenter.name,
              value: datacenter.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modals>
  );
};

export default RackModal;
