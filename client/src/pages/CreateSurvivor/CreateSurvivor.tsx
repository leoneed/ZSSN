import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Gender,
  IInventoryCreate,
  IItem,
  ISurvivor,
  ISurvivorCreate,
} from '../../types';
import { useCreateSurvivor, useGetItems } from '../../api';
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from 'antd';
import { t } from '../../utils';
import style from './createSurvivor.module.scss';
import { useNavigate } from 'react-router-dom';

const CreateSurvivor = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ISurvivorCreate>({
    defaultValues: {
      inventory: [],
    },
  });
  const navigate = useNavigate();
  const { mutate: createSurvivor, isPending: createSurvivorIsPending } =
    useCreateSurvivor(
      ({ id, name }: ISurvivor) => {
        message.success(`${t('Survivor Created:')} ${name}`);
        navigate(`/survivors/${id}`);
      },
      (error) => {
        message.error(`${t('Server error')}: ${error.message}`);
      }
    );
  const { data: items = [], isPending: itemsIsPending } = useGetItems();

  const onSubmit = (data: ISurvivorCreate) => {
    const inventory: IInventoryCreate[] = items
      .map((item) => ({
        item_id: item.id,
        quantity: data.inventory?.[item.id]?.quantity || 0,
      }))
      .filter((inv) => inv.quantity > 0);

    createSurvivor({
      ...data,
      age: Number(data.age),
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      inventory,
    });
  };

  return (
    <Form
      onFinish={handleSubmit(onSubmit)}
      layout="vertical"
      className={style.form}
    >
      <Form.Item
        label={t('Name')}
        validateStatus={errors.name ? 'error' : ''}
        help={errors.name?.message}
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: t('Name is required') }}
          render={({ field }) => <Input maxLength={100} {...field} />}
        />
      </Form.Item>

      <Form.Item
        label={t('Age')}
        validateStatus={errors.age ? 'error' : ''}
        help={errors.age?.message}
      >
        <Controller
          name="age"
          control={control}
          rules={{
            required: t('Age is required'),
            min: { value: 1, message: t('Too young') },
            max: { value: 130, message: t('Too old') },
          }}
          render={({ field }) => <Input type="number" {...field} />}
        />
      </Form.Item>

      <Form.Item
        label="Gender"
        validateStatus={errors.gender ? 'error' : ''}
        help={errors.gender?.message}
      >
        <Controller
          name="gender"
          control={control}
          rules={{ required: t('Gender is required') }}
          render={({ field }) => (
            <Select {...field} placeholder={t('Select Gender')}>
              <Select.Option value={Gender.male}>{t('Male')}</Select.Option>
              <Select.Option value={Gender.female}>{t('Female')}</Select.Option>
              <Select.Option value={Gender.other}>{t('Other')}</Select.Option>
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item
        label="Latitude"
        validateStatus={errors.latitude ? 'error' : ''}
        help={errors.latitude?.message}
      >
        <Controller
          name="latitude"
          control={control}
          rules={{
            required: t('Latitude is required'),
            min: { value: -90, message: t('Min latitude is -90') },
            max: { value: 90, message: t('Max latitude is 90') },
          }}
          render={({ field }) => (
            <Input type="number" step="0.0001" {...field} />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Longitude"
        validateStatus={errors.longitude ? 'error' : ''}
        help={errors.longitude?.message}
      >
        <Controller
          name="longitude"
          control={control}
          rules={{
            required: t('Longitude is required'),
            min: { value: -180, message: t('Min longitude is -180') },
            max: { value: 180, message: t('Max longitude is 180') },
          }}
          render={({ field }) => (
            <Input type="number" step="0.0001" {...field} />
          )}
        />
      </Form.Item>

      <Card loading={itemsIsPending} className={style.inventory}>
        <Card.Meta title={t('Inventory')} />
        {items?.map((item: IItem, index) => (
          <Form.Item
            key={item.id}
            label={item.name}
            layout="horizontal"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 8 }}
          >
            <Controller
              name={`inventory.${item.id}.quantity`}
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <InputNumber
                  className={style.quantityInput}
                  {...field}
                  type="number"
                  min={0}
                  max={1000000}
                  step={1}
                  precision={0}
                  value={field.value ?? 0}
                  onChange={(value) => field.onChange(value ?? 0)}
                />
              )}
            />
          </Form.Item>
        ))}
      </Card>

      <Divider />

      <Button
        type="primary"
        htmlType="submit"
        loading={createSurvivorIsPending || itemsIsPending}
      >
        {t('Create Survivor')}
      </Button>
    </Form>
  );
};

export default CreateSurvivor;
