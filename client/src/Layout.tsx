import { Button, Col, Layout, Row } from 'antd';
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import style from './layout.module.scss';
import { t } from './utils';
import { useSurvivorContext } from './context/SurvivorContext';
import IsInfected from './components/IsInfected/IsInfected';

const { Header, Content, Footer } = Layout;

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, logout, loggedInSurvivor } = useSurvivorContext();

  return (
    <Layout>
      <Sidebar />
      <Layout>
        <Header className={style.header}>
          <Row>
            <Col span={12}>
              <h1>{t('ZSSN - Zombie Survival Network')}</h1>
            </Col>
            {isLoggedIn && (
              <Col span={12} className={style.loggedInSurvivor}>
                <IsInfected infected={loggedInSurvivor?.is_infected || false} />
                <span>
                  {t('Hello')} {loggedInSurvivor?.name}
                </span>
                <Button onClick={logout}>{t('Logout')}</Button>
              </Col>
            )}
          </Row>
        </Header>
        <Content>
          <div className={style.content}>{children}</div>
        </Content>
        <Footer>ZSSN ©{new Date().getFullYear()}</Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
