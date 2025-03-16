import { Modal, Button, Form } from 'antd';
import { useModal } from '../../hooks';
import { t } from '../../utils';
import { useForm } from 'react-hook-form';
import { ILocation, ISurvivor } from '../../types';
import LocationFormItem from '../Form/LocationFormItem';
import { useUpdateLocation } from '../../api';

const LocationUpdate = ({
  survivor,
  disabled = false,
}: {
  survivor: ISurvivor;
  disabled?: boolean;
}) => {
  const { isModalOpen, closeModal, openModal } = useModal();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILocation>({
    defaultValues: {
      latitude: survivor.latitude,
      longitude: survivor.longitude,
    },
  });
  const { mutate: updateLocation, isPending, reset } = useUpdateLocation();

  if (!survivor) return null;

  const onSubmit = (location: ILocation) => {
    const longitude = Number(location.longitude);
    const latitude = Number(location.latitude);
    const isLocationChanged = !(
      longitude === survivor.longitude && latitude === survivor.latitude
    );

    if (!isPending && isLocationChanged) {
      updateLocation(
        {
          survivorId: survivor.id,
          location: {
            longitude,
            latitude,
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
      <Button type="primary" onClick={openModal} disabled={disabled}>
        {t('Update location')}
      </Button>

      <Modal
        title={t('Set new location')}
        open={isModalOpen}
        onOk={handleSubmit(onSubmit)}
        onCancel={closeModal}
        confirmLoading={isPending}
      >
        <Form layout="vertical">
          <LocationFormItem control={control} errors={errors} />
        </Form>
      </Modal>
    </>
  );
};

export default LocationUpdate;
