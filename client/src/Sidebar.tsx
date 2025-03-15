/* eslint-disable no-restricted-globals */
import React from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { t } from './utils';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    label: <Link to="/survivors">{t('Survivors List')}</Link>,
    key: '/survivors',
    icon: <UserOutlined />,
  },
];

const Sidebar = () => (
  <Sider>
    <Menu theme="dark" selectedKeys={[location.pathname]} items={menuItems} />
  </Sider>
);

export default Sidebar;
