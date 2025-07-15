import React, { useEffect } from "react";
import { Layout as AntLayout, Menu, Drawer } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  MessageOutlined,
  BookOutlined,
  SettingOutlined,
  HomeOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { Header } from "./Header";
import { useChatStore } from "@/stores/chatStore";

const { Sider, Content } = AntLayout;

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { useKnowledgeBase, setUseKnowledgeBase } = useChatStore();
  const store = useChatStore();

  useEffect(() => {
    console.log(JSON.stringify(store, null, 2));
  }, []);

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "智能对话",
      onClick: () => navigate("/"),
    },
    {
      key: "/chat",
      icon: <MessageOutlined />,
      label: "聊天界面",
      onClick: () => navigate("/chat"),
    },
    {
      key: "/knowledge",
      icon: <BookOutlined />,
      label: "知识管理",
      onClick: () => navigate("/knowledge"),
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "用户设置",
      onClick: () => navigate("/settings"),
    },
    {
      key: "/test",
      icon: <ExperimentOutlined />,
      label: "表单测试",
      onClick: () => navigate("/test"),
    },
  ];

  const handleMenuClick = (key: string) => {
    const item = menuItems.find((item) => item.key === key);
    if (item?.onClick) {
      item.onClick();
      setMobileMenuOpen(false);
    }
  };

  // 桌面端侧边栏
  const DesktopSider = (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className="bg-white shadow-sm"
      width={240}
      collapsedWidth={80}
    >
      <div className="h-16 flex items-center justify-center border-b">
        {!collapsed && (
          <span className="font-bold text-blue-600">导航菜单</span>
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
        className="border-none"
      />
    </Sider>
  );

  // 移动端抽屉菜单
  const MobileDrawer = (
    <Drawer
      title="导航菜单"
      placement="left"
      onClose={() => setMobileMenuOpen(false)}
      open={mobileMenuOpen}
      styles={{ body: { padding: 0 } }}
      width={280}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
        className="border-none"
      />
    </Drawer>
  );

  return (
    <AntLayout className="h-screen">
      {/* 桌面端侧边栏 */}
      <div className="hidden md:block">{DesktopSider}</div>

      {/* 移动端抽屉 */}
      <div className="md:hidden">{MobileDrawer}</div>

      <AntLayout>
        <Header
          useKnowledgeBase={useKnowledgeBase}
          onKnowledgeBaseChange={setUseKnowledgeBase}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <Content className="overflow-auto">
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};
