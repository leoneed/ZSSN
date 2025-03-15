import axios from 'axios';
import {
  MutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { IItem, ISurvivor, ISurvivorCreate } from './types';

const API_URL = 'http://localhost:8000/api'; //TODO: move to env config

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

export const useSurvivor = (id: number | null) =>
  useQuery({
    queryKey: [survivorQueryKey, id],
    queryFn: async () => {
      if (id !== null) {
        const { data: survivor } = await api.get<ISurvivor>(`survivors/${id}`);

        return survivor;
      }

      return null;
    },
  });

export const useCreateSurvivor = (
  onSuccess?: (data: ISurvivor) => void,
  onError?: (error: Error) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSurvivor: ISurvivorCreate) => {
      const { data } = await api.post('survivors', newSurvivor);

      return data;
    },
    onSuccess: (data: ISurvivor) => {
      queryClient.invalidateQueries({ queryKey: [survivorsQueryKey] });
      onSuccess && onSuccess(data);
    },
    onError,
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
