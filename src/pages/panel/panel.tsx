import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import MainContent from "./mainContent";
import SideBar from "../../components/sideBar";
const Panel = () => {
 
  return (
    <Layout className="text-white h-screen">
      <Header className="flex justify-between">
        <span>پنل مدیریتی زیرساخت‌ها</span>
      </Header>
      <Layout>
        <Sider breakpoint="md">
          <SideBar />
        </Sider>
        <Content>
          <MainContent />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Panel;
