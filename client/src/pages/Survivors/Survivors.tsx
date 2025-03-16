import React, { useMemo } from 'react';
import { useSurvivors } from '../../api';
import Layout from 'antd/es/layout/layout';
import { Button, Divider, Table, TableProps } from 'antd';
import { t } from '../../utils';
import { ISurvivor } from '../../types';
import { Link } from 'react-router-dom';
import IsInfected from '../../components/IsInfected/IsInfected';
import { useSurvivorContext } from '../../context/SurvivorContext';

const defaultColumns: TableProps<ISurvivor>['columns'] = [
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
    title: t('Actions'),
    key: 'action',
    render: (_, { id }) => (
      <Link to={`/survivors/${id}`}>{t('View Profile')}</Link>
    ),
  },
];

const Survivors = () => {
  const { loggedInSurvivor, login } = useSurvivorContext();
  const { data: survivors } = useSurvivors();

  const dataSource = useMemo(
    () => (survivors ?? []).map((suv: ISurvivor) => ({ key: suv.id, ...suv })),
    [survivors]
  );

  const columns: TableProps<ISurvivor>['columns'] = [
    ...defaultColumns,
    {
      title: '',
      key: 'login',
      render: (_, { id }) =>
        loggedInSurvivor?.id !== id && (
          <Button type="primary" onClick={() => login(id)}>
            {t('Login')}
          </Button>
        ),
    },
  ];

  return (
    <Layout>
      <Divider>{t('Survivors List')}</Divider>
      <div style={{ overflowX: 'auto' }}>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </Layout>
  );
};

export default Survivors;
