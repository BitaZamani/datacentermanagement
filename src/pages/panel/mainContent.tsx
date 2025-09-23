import { useSelector } from "react-redux";
import type { RootState } from "../../slices/store";
import Datacenters from "../../components/datacenters";
import Racks from "../../components/racks";
import Dashboard from "../../components/dashboard";

const MainContent = () => {
  const menuKey = useSelector((state: RootState) => state.interaction.menuKey);
  const renderContent = () => {
    if (menuKey === "datacenters") return <Datacenters />;
    else if (menuKey === "racks") return <Racks />;
    else return <Dashboard />;
  };

  return <div>{renderContent()}</div>;
};

export default MainContent;
