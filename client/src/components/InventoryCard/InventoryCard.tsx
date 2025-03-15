import { Card, Table } from 'antd';
import React, { useMemo } from 'react';
import { t } from '../../utils';
import { IInventory } from '../../types';

const InventoryCard = ({ inventory }: { inventory: IInventory[] }) => {
  const dataSource = useMemo(
    () => inventory.map((inv: IInventory) => ({ key: inv.item_id, ...inv })),
    [inventory]
  );

  return (
    <Card title={t('Inventory')}>
      <Table dataSource={dataSource} columns={columns} />
    </Card>
  );
};

const columns = [
  {
    title: 'Item',
    dataIndex: 'item_name',
    key: 'item',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
];

export default InventoryCard;
