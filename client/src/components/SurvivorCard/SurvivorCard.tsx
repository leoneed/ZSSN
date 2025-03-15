import React, { useMemo } from 'react';
import { Card, List } from 'antd';
import { t } from '../../utils';
import IsInfected from '../../components/IsInfected/IsInfected';
import { ISurvivor } from '../../types';

const SurvivorCard = ({ survivor }: { survivor: ISurvivor }) => {
  const dataSource = useMemo(
    () =>
      survivor
        ? [
            { title: t('Age'), value: survivor.age },
            { title: t('Gender'), value: survivor.gender },
            { title: t('Latitude'), value: survivor.latitude },
            { title: t('Longitude'), value: survivor.longitude },
            {
              title: t('Is Infected'),
              value: <IsInfected infected={survivor.is_infected} />,
            },
          ]
        : [],
    [survivor]
  );

  if (!survivor) return null;

  return (
    <Card title={`Survivor: ${survivor.name}`}>
      <List
        itemLayout="horizontal"
        dataSource={dataSource}
        renderItem={({ title, value }) => (
          <List.Item>
            <List.Item.Meta title={title} description={value} />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default SurvivorCard;
