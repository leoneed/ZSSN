import React from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircleFilled, UserOutlined } from '@ant-design/icons';
import { t } from './utils';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    label: <Link to="/survivors/create">{t('Create Survivor')}</Link>,
    key: '/survivors/create',
    icon: <PlusCircleFilled />,
  },
  {
    label: <Link to="/survivors">{t('Survivors List')}</Link>,
    key: '/survivors',
    icon: <UserOutlined />,
  },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <Sider>
      <Menu theme="dark" selectedKeys={[location.pathname]} items={menuItems} />
    </Sider>
  );
};

export default Sidebar;
