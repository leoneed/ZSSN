import { Form, Input } from 'antd';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { t } from '../../utils';
import { ILocation } from '../../types';

interface LocationFormItemProps {
  errors: FieldErrors<ILocation>;
  control: Control<ILocation, any>;
}

const LocationFormItem = ({ errors, control }: LocationFormItemProps) => {
  return (
    <>
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
    </>
  );
};

export default LocationFormItem;
