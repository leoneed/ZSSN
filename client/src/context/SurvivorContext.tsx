import { createContext, useContext, useState } from 'react';
import { ISurvivor } from '../types';
import { useSurvivor } from '../api';

interface SurvivorContextType {
  isLoggedIn: boolean;
  loggedInSurvivor: ISurvivor | null;
  login: (survivorId: number) => void;
  logout: () => void;
}

const SurvivorContext = createContext<SurvivorContextType | undefined>(
  undefined
);

export const SurvivorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [survivorId, setSurvivorId] = useState<number | null>(null);
  const { data: survivor = null } = useSurvivor(survivorId);

  const login = (survivorId: number) => setSurvivorId(survivorId);
  const logout = () => setSurvivorId(null);

  return (
    <SurvivorContext.Provider
      value={{
        isLoggedIn: !!survivor,
        loggedInSurvivor: survivor,
        login,
        logout,
      }}
    >
      {children}
    </SurvivorContext.Provider>
  );
};

export const useSurvivorContext = () => {
  const context = useContext(SurvivorContext);

  if (!context) {
    throw new Error('useSurvivorContext not in SurvivorProvider');
  }

  return context;
};
