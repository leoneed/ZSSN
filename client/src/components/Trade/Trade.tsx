import { Button, Form, InputNumber, Modal } from 'antd';
import React, { useMemo } from 'react';
import { t } from '../../utils';
import { useModal } from '../../hooks';
import { IInventory, ISurvivor, ITradeItem } from '../../types';
import { Controller, FieldPath, useForm } from 'react-hook-form';
import { useGetItems, useTradeItems } from '../../api';

type TradeFormItems = Record<number, { quantity: number }>;

interface ITradeForm {
  propose_items: TradeFormItems;
  requested_items: TradeFormItems;
}

const mapTradeItems = (items: TradeFormItems): ITradeItem[] =>
  Object.entries(items)
    .filter(([_, item]) => item.quantity > 0)
    .map(([item_id, item]) => ({
      item_id: Number(item_id),
      quantity: item.quantity,
    }));

const Trade = ({
  disabled,
  proposer,
  recipient,
}: {
  disabled: boolean;
  proposer: ISurvivor;
  recipient: ISurvivor;
}) => {
  const { isModalOpen, closeModal, openModal } = useModal();
  const { data: items = [] } = useGetItems();
  const { handleSubmit, control, reset } = useForm<ITradeForm>({
    defaultValues: {
      propose_items: {},
      requested_items: {},
    },
  });
  const { mutate: tradeItems, isPending } = useTradeItems();

  const itemsMap = useMemo(
    () =>
      items.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: item.points,
        }),
        {} as Record<number, number>
      ),
    [items]
  );

  const onSubmit = (data: ITradeForm) => {
    if (!isPending) {
      tradeItems(
        {
          survivorId: recipient.id,
          trade: {
            proposer_id: proposer.id,
            propose_items: mapTradeItems(data.propose_items),
            requested_items: mapTradeItems(data.requested_items),
          },
        },
        {
          onSuccess: () => {
            reset();
            closeModal();
          },
        }
      );
    }
  };

  return (
    <>
      <Button disabled={disabled} type="primary" onClick={openModal}>
        {t('Trade')}
      </Button>
      <Modal
        title={t('Trade')}
        open={isModalOpen}
        onOk={handleSubmit(onSubmit)}
        onCancel={closeModal}
        confirmLoading={isPending}
      >
        <Form layout="vertical">
          <h3>{t('You Offer')}</h3>

          {proposer.inventory.map((item: IInventory) => (
            <Form.Item
              key={item.item_id}
              label={`${item.item_name} (points: ${itemsMap[item.item_id] ?? '?'}, max: ${item.quantity})`}
            >
              <Controller
                name={
                  `propose_items.${item.item_id}.quantity` as FieldPath<ITradeForm>
                }
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    max={item.quantity}
                    step={1}
                    precision={0}
                    value={(field.value ?? 0) as unknown as number}
                    onChange={(value) => field.onChange(value ?? 0)}
                  />
                )}
              />
            </Form.Item>
          ))}

          <h3>{t('You Receive')}</h3>

          {recipient.inventory.map((item: IInventory) => (
            <Form.Item
              key={item.item_id}
              label={`${item.item_name} (points: ${itemsMap[item.item_id] ?? '?'}, max: ${item.quantity})`}
            >
              <Controller
                name={
                  `requested_items.${item.item_id}.quantity` as keyof ITradeForm
                }
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    max={item.quantity}
                    step={1}
                    precision={0}
                    value={(field.value ?? 0) as unknown as number}
                    onChange={(value) => field.onChange(value ?? 0)}
                  />
                )}
              />
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </>
  );
};

export default Trade;
