import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined } from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = () => (
    <Sider>
        <Menu theme='dark'>
            <Menu.Item key="1" icon={<UserOutlined />}>
                <Link to="/survivors">Survivors List</Link>
            </Menu.Item>
        </Menu>
    </Sider>
);

export default Sidebar;
