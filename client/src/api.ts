import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ISurvivor } from './types';

const API_URL = 'http://localhost:8000/api'; //TODO: move to env config

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useSurvivors = () =>
  useQuery({
    queryKey: ['survivors'],
    queryFn: async () => {
      const { data: survivors } = await api.get<ISurvivor[]>('survivors');

      return survivors;
    },
  });

export const useSurvivor = (id: Number) =>
  useQuery({
    queryKey: ['survivor', id],
    queryFn: async () => {
      const { data: survivor } = await api.get<ISurvivor>(`survivors/${id}`);

      return survivor;
    },
  });
