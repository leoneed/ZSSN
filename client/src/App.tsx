import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './Layout';
import Survivors from './pages/Survivors/Survivors';
import Profile from './pages/Profile/Profile';
import CreateSurvivor from './pages/CreateSurvivor/CreateSurvivor';

const App = () => (
  <AppLayout>
    <Routes>
      <Route path="/survivors" element={<Survivors />} />
      <Route path="/survivors/:id" element={<Profile />} />
      <Route path="/survivors/create" element={<CreateSurvivor />} />
    </Routes>
  </AppLayout>
);

export default App;
