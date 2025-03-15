import React, { useMemo } from 'react';
import { useSurvivors } from '../../api';
import Layout from 'antd/es/layout/layout';
import { Divider, Table, TableProps } from 'antd';
import { t } from '../../utils';
import { ISurvivor } from '../../types';
import { Link } from 'react-router-dom';
import IsInfected from '../../components/IsInfected/IsInfected';

const Survivors = () => {
  const { data: survivors } = useSurvivors();

  const dataSource = useMemo(
    () => (survivors ?? []).map((suv: ISurvivor) => ({ key: suv.id, ...suv })),
    [survivors]
  );

  return (
    <Layout>
      <Divider>{t('Survivors List')}</Divider>
      <Table dataSource={dataSource} columns={columns} />
    </Layout>
  );
};

const columns: TableProps<ISurvivor>['columns'] = [
  { title: t('Name'), dataIndex: 'name', key: 'name' },
  { title: t('Age'), dataIndex: 'age', key: 'age' },
  { title: t('Gender'), dataIndex: 'gender', key: 'gender' },
  { title: t('Latitude'), dataIndex: 'latitude', key: 'latitude' },
  { title: t('Longitude'), dataIndex: 'longitude', key: 'longitude' },
  {
    title: t('Is Infected'),
    dataIndex: 'is_infected',
    key: 'is_infected',
    render: (_, { is_infected }) => <IsInfected infected={is_infected} />,
  },
  {
    title: t('Action'),
    key: 'action',
    render: (_, { id }) => (
      <Link to={`/survivors/${id}`}>{t('View Profile')}</Link>
    ),
  },
];

export default Survivors;
