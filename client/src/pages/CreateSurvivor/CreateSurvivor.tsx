import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Gender, ISurvivor, ISurvivorCreate } from '../../types';
import { useCreateSurvivor } from '../../api';
import { Button, Form, Input, Select, message } from 'antd';
import { t } from '../../utils';

const CreateSurvivor = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ISurvivorCreate>();
  const { mutate: createSurvivor, isPending } = useCreateSurvivor(
    (data: ISurvivor) => {
      message.success(`${t('Survivor Created:')} ${data.name}`);
    },
    (error) => {
      message.error(`${t('Server error')}: ${error.message}`);
    }
  );

  const onSubmit = (data: ISurvivorCreate) => {
    createSurvivor({
      ...data,
      age: Number(data.age),
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
    });
  };

  return (
    <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
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

      <Button type="primary" htmlType="submit" loading={isPending}>
        {t('Create Survivor')}
      </Button>
    </Form>
  );
};

export default CreateSurvivor;
