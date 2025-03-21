import React from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import {
  Gender,
  IInventoryCreate,
  IItem,
  ILocation,
  ISurvivor,
  ISurvivorCreate,
} from '../../types';
import { useCreateSurvivor, useGetItems } from '../../api';
import { Button, Card, Divider, Form, Input, InputNumber, Select } from 'antd';
import { t } from '../../utils';
import style from './createSurvivor.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSurvivorContext } from '../../context/SurvivorContext';
import LocationFormItem from '../../components/Form/LocationFormItem';

const CreateSurvivor = () => {
  const { login } = useSurvivorContext();
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
    useCreateSurvivor();
  const { data: items = [], isPending: itemsIsPending } = useGetItems();

  const onSubmit = (data: ISurvivorCreate) => {
    const inventory: IInventoryCreate[] = items
      .map((item) => ({
        item_id: item.id,
        quantity: data.inventory?.[item.id]?.quantity || 0,
      }))
      .filter((inv) => inv.quantity > 0);

    createSurvivor(
      {
        ...data,
        age: Number(data.age),
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        inventory,
      },
      {
        onSuccess: ({ id }: ISurvivor) => {
          login(id);
          navigate(`/survivors/${id}`);
        },
      }
    );
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

      <LocationFormItem
        control={control as unknown as Control<ILocation>}
        errors={errors}
      />

      <Card loading={itemsIsPending} className={style.inventory}>
        <Card.Meta title={t('Inventory')} />
        {items?.map((item: IItem) => (
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
