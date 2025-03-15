import React from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeFilled, PlusCircleFilled, UserOutlined } from '@ant-design/icons';
import { t } from './utils';
import { useSurvivorContext } from './context/SurvivorContext';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const defaultMenuItems: MenuItem[] = [
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
  const { isLoggedIn, loggedInSurvivor } = useSurvivorContext();
  const location = useLocation();

  const dynamicMenuItems = isLoggedIn
    ? [
        {
          label: (
            <Link to={`/survivors/${loggedInSurvivor?.id}`}>
              {t('My Profile')}
            </Link>
          ),
          key: `/survivors/${loggedInSurvivor?.id}`,
          icon: <HomeFilled />,
        },
      ]
    : [];

  const menuItems = [...defaultMenuItems, ...dynamicMenuItems];

  return (
    <Sider>
      <Menu theme="dark" selectedKeys={[location.pathname]} items={menuItems} />
    </Sider>
  );
};

export default Sidebar;
