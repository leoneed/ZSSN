import React from 'react';
import { useParams } from 'react-router-dom';
import { useSurvivor } from '../../api';
import { Col, Row } from 'antd';
import style from './profile.module.scss';
import SurvivorCard from '../../components/SurvivorCard/SurvivorCard';
import InventoryCard from '../../components/InventoryCard/InventoryCard';

const Profile = () => {
  const { id } = useParams();
  const { data: survivor } = useSurvivor(Number(id));

  if (!survivor) return null;

  return (
    <Row>
      <Col className={style.column} span={10}>
        <SurvivorCard survivor={survivor} />
      </Col>
      <Col className={style.column} span={6}>
        <InventoryCard inventory={survivor.inventory} />
      </Col>
    </Row>
  );
};

export default Profile;
