import React from 'react';
import infectedImage from './img/infected.png';
import inotInfectedImage from './img/notInfected.png';
import style from './isInfected.module.scss';
import { t } from '../../utils';

const IsInfected = ({ infected }: { infected: boolean }) =>
  infected ? (
    <img className={style.image} src={infectedImage} alt={t('Infected')} />
  ) : (
    <img
      className={style.image}
      src={inotInfectedImage}
      alt={t('Not infected')}
    />
  );

export default IsInfected;
