import React from 'react';
import { useParams } from 'react-router-dom';
import { useSurvivor } from '../../api';
import { Col, Row } from 'antd';
import style from './profile.module.scss';
import SurvivorCard from '../../components/SurvivorCard/SurvivorCard';
import InventoryCard from '../../components/InventoryCard/InventoryCard';
import { useSurvivorContext } from '../../context/SurvivorContext';
import LocationUpdate from '../../components/LocationUpdate/LocationUpdate';

const Profile = () => {
  const { id } = useParams();
  const { data: survivor } = useSurvivor(Number(id));
  const { loggedInSurvivor, isLoggedIn } = useSurvivorContext();

  if (!survivor) return null;

  const isCurrentSurvivorLoggedIn =
    isLoggedIn && loggedInSurvivor?.id === survivor.id;
  const isSurvivorCanUpdateLocation =
    isCurrentSurvivorLoggedIn && !survivor.is_infected;

  return (
    <>
      <Row>
        <Col className={style.column} span={10}>
          <SurvivorCard survivor={survivor} />
        </Col>
        <Col className={style.column} span={6}>
          <InventoryCard inventory={survivor.inventory} />
        </Col>
        {isCurrentSurvivorLoggedIn && (
          <Col className={style.column} span={6}>
            <LocationUpdate
              survivor={loggedInSurvivor}
              disabled={!isSurvivorCanUpdateLocation}
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default Profile;
