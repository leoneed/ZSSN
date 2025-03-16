import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IItem, ILocation, ISurvivor, ISurvivorCreate, ITrade } from './types';
import { message } from 'antd';
import { t } from './utils';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const survivorsQueryKey = 'survivors';
const survivorQueryKey = 'survivor';
const itemsQueryKey = 'items';

export const useSurvivors = () =>
  useQuery({
    queryKey: [survivorsQueryKey],
    queryFn: async () => {
      const { data: survivors } = await api.get<ISurvivor[]>('survivors');

      return survivors;
    },
  });

export const useSurvivor = (survivorId: number | null) =>
  useQuery({
    queryKey: [survivorQueryKey, survivorId],
    queryFn: async () => {
      if (survivorId !== null) {
        const { data: survivor } = await api.get<ISurvivor>(
          `survivors/${survivorId}`
        );

        return survivor;
      }

      return null;
    },
  });

export const useCreateSurvivor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSurvivor: ISurvivorCreate) => {
      const { data } = await api.post('survivors', newSurvivor);

      return data;
    },
    onSuccess: (data: ISurvivor) => {
      message.success(`${t('Survivor Created:')} ${data.name}`);

      queryClient.invalidateQueries({ queryKey: [survivorsQueryKey] });
    },
    onError: (error: any) => {
      message.error(`${t('Create request failed')}: ${error?.message}`);
    },
  });
};

export const useGetItems = () =>
  useQuery({
    queryKey: [itemsQueryKey],
    queryFn: async () => {
      const { data: items } = await api.get<IItem[]>('items');

      return items;
    },
  });

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      survivorId,
      location,
    }: {
      survivorId: number;
      location: ILocation;
    }) => {
      const { data } = await api.put(
        `/survivors/${survivorId}/location`,
        location
      );

      return data;
    },
    onSuccess: (_, { survivorId }) => {
      message.success(t('Location updated successfully'));

      queryClient.invalidateQueries({ queryKey: [survivorsQueryKey] });
      queryClient.invalidateQueries({
        queryKey: [survivorQueryKey, survivorId],
      });
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || t('Location updated successfully')
      );
    },
  });
};

export const useReportInfection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      survivorId,
      reporterId,
    }: {
      survivorId: number;
      reporterId: number;
    }) => {
      const { data } = await api.post<{ message: string }>(
        `/survivors/${survivorId}/report-infection`,
        { reporter_id: reporterId }
      );

      return data;
    },
    onSuccess: (_, { survivorId }) => {
      queryClient.invalidateQueries({ queryKey: [survivorsQueryKey] });
      queryClient.invalidateQueries({
        queryKey: [survivorQueryKey, survivorId],
      });

      message.success(t('Infection reported'));
    },
    onError: (error: any) => {
      message.error(
        t(error.response?.data?.error || t('Failed to report infection'))
      );
    },
  });
};

export const useTradeItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      survivorId,
      trade,
    }: {
      survivorId: number;
      trade: ITrade;
    }) => {
      const response = await api.post(`/survivors/${survivorId}/trade`, trade);

      return response.data;
    },
    onSuccess: (_, { survivorId, trade }) => {
      queryClient.invalidateQueries({ queryKey: [survivorsQueryKey] });
      queryClient.invalidateQueries({
        queryKey: [survivorQueryKey, survivorId],
      });
      queryClient.invalidateQueries({
        queryKey: [survivorQueryKey, trade.proposer_id],
      });

      message.success(t('Trade successful!'));
    },
    onError: () => {
      message.error(`${t('Trade failed')}`);
    },
  });
};
