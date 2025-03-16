import React from 'react';
import { useParams } from 'react-router-dom';
import { useReportInfection, useSurvivor } from '../../api';
import { Button, Col, List, Row } from 'antd';
import style from './profile.module.scss';
import SurvivorCard from '../../components/SurvivorCard/SurvivorCard';
import InventoryCard from '../../components/InventoryCard/InventoryCard';
import { useSurvivorContext } from '../../context/SurvivorContext';
import LocationUpdate from '../../components/LocationUpdate/LocationUpdate';
import { t } from '../../utils';
import Trade from '../../components/Trade/Trade';

const Profile = () => {
  const { id } = useParams();
  const { data: survivor } = useSurvivor(Number(id));
  const { loggedInSurvivor } = useSurvivorContext();
  const { mutate: reportInfection, isPending: reportIsPending } =
    useReportInfection();

  const isLoggedIn = !!loggedInSurvivor;

  if (!survivor) return null;

  const isCurrentSurvivorLoggedIn =
    isLoggedIn && loggedInSurvivor.id === survivor.id;
  const isSurvivorCanUpdateLocation =
    isCurrentSurvivorLoggedIn && !survivor.is_infected;
  const isCanDoReports =
    isLoggedIn && !isCurrentSurvivorLoggedIn && loggedInSurvivor;

  return (
    <>
      <Row gutter={[16, 16]} justify="center">
        <Col className={style.column} xs={24} sm={24} md={12} lg={8}>
          <SurvivorCard survivor={survivor} />
        </Col>
        <Col className={style.column} xs={24} sm={24} md={12} lg={8}>
          <div>
            <InventoryCard inventory={survivor.inventory} />
          </div>
        </Col>
        {isLoggedIn && (
          <Col className={style.column} xs={24} sm={24} md={12} lg={8}>
            <List>
              {isCurrentSurvivorLoggedIn && (
                <List.Item>
                  <LocationUpdate
                    survivor={loggedInSurvivor}
                    disabled={!isSurvivorCanUpdateLocation}
                  />
                </List.Item>
              )}
              {isCanDoReports && (
                <List.Item>
                  <Button
                    type="primary"
                    onClick={() =>
                      reportInfection({
                        survivorId: survivor.id,
                        reporterId: loggedInSurvivor.id,
                      })
                    }
                    disabled={survivor.is_infected || reportIsPending}
                  >
                    {t('Report infection')}
                  </Button>
                </List.Item>
              )}
              {isLoggedIn && !isCurrentSurvivorLoggedIn && (
                <List.Item>
                  <Trade
                    proposer={loggedInSurvivor}
                    recipient={survivor}
                    disabled={
                      survivor.is_infected || loggedInSurvivor.is_infected
                    }
                  />
                </List.Item>
              )}
            </List>
          </Col>
        )}
      </Row>
    </>
  );
};

export default Profile;
