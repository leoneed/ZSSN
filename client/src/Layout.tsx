import { Layout } from 'antd';
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import style from './layout.module.scss';
import { t } from './utils';

const { Header, Content, Footer } = Layout;

const AppLayout = ({ children }: { children: ReactNode }) => (
  <Layout>
    <Sidebar />
    <Layout>
      <Header className={style.header}>
        <h1>{t('ZSSN - Zombie Survival Network')}</h1>
      </Header>
      <Content>
        <div className={style.content}>{children}</div>
      </Content>
      <Footer>ZSSN ©{new Date().getFullYear()}</Footer>
    </Layout>
  </Layout>
);

export default AppLayout;
