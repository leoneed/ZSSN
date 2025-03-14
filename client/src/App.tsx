import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './Layout';
import Survivors from './pages/Survivors';

const App = () => (
    <AppLayout>
        <Routes>
            <Route path="/survivors" element={<Survivors />} />
        </Routes>
    </AppLayout>
);

export default App;
