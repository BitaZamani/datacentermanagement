import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../slices/store";
import { Form } from "antd";
import Inputs from "./ui/inputs";
import Modals from "./ui/modal";
import { saveDataCenter } from "../slices/dbSlice";
import { setOpenDataCenterModal } from "../slices/interactionSlice";

const DataCenterModal = () => {
  const dataCenter = useSelector((state: RootState) => state.db.dataCenter);
  const error = useSelector((state: RootState) => state.db.dataCenterError);
  const open = useSelector(
    (state: RootState) => state.interaction.openDataCenterModal
  );
  const dispatch = useDispatch<AppDispatch>();
  const onCancel = () => {
    dispatch(setOpenDataCenterModal(false));
  };
  const onFinish = (values: { name: string; description: string }) => {
    dispatch(
      saveDataCenter({
        ...dataCenter,
        name: values.name,
        description: values.description,
      })
    );
    if (!error) dispatch(setOpenDataCenterModal(false));
  };
  return (
    <Modals
      open={open}
      okText={"افزودن"}
      onCancel={onCancel}
      form={"dataCenterForm"}
    >
      <Form
        id="dataCenterForm"
        layout="vertical"
        initialValues={{
          name: dataCenter.name || "",
          description: dataCenter.description || "",
        }}
        onFinish={(values) => onFinish(values)}
      >
        <Inputs type="text" label="عنوان" name="name" />
        <Inputs type="text" label="توضیحات" name="description" />
      </Form>
    </Modals>
  );
};

export default DataCenterModal;
