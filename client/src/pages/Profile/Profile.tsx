import React from 'react';
import { useParams } from 'react-router-dom';
import { useReportInfection, useSurvivor } from '../../api';
import { Button, Col, Row } from 'antd';
import style from './profile.module.scss';
import SurvivorCard from '../../components/SurvivorCard/SurvivorCard';
import InventoryCard from '../../components/InventoryCard/InventoryCard';
import { useSurvivorContext } from '../../context/SurvivorContext';
import LocationUpdate from '../../components/LocationUpdate/LocationUpdate';
import { t } from '../../utils';

const Profile = () => {
  const { id } = useParams();
  const { data: survivor } = useSurvivor(Number(id));
  const { loggedInSurvivor, isLoggedIn } = useSurvivorContext();
  const { mutate: reportInfection, isPending: reportIsPending } =
    useReportInfection();

  if (!survivor) return null;

  const isCurrentSurvivorLoggedIn =
    isLoggedIn && loggedInSurvivor?.id === survivor.id;
  const isSurvivorCanUpdateLocation =
    isCurrentSurvivorLoggedIn && !survivor.is_infected;
  const isCanDoReports =
    isLoggedIn && !isCurrentSurvivorLoggedIn && loggedInSurvivor;

  return (
    <>
      <Row>
        <Col className={style.column} span={10}>
          <SurvivorCard survivor={survivor} />
        </Col>
        <Col className={style.column} span={6}>
          <InventoryCard inventory={survivor.inventory} />
        </Col>
        {isLoggedIn && (
          <Col className={style.column} span={6}>
            {isCurrentSurvivorLoggedIn && (
              <LocationUpdate
                survivor={loggedInSurvivor}
                disabled={!isSurvivorCanUpdateLocation}
              />
            )}
            {isCanDoReports && (
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
            )}
          </Col>
        )}
      </Row>
    </>
  );
};

export default Profile;
