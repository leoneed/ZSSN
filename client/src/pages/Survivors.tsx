import React from 'react';
import { useSurvivors } from '../api';

const Survivors = () => {
    const { data: survivors } = useSurvivors();

    return (
        <pre>{JSON.stringify(survivors, null, 2)}</pre>
    );
};

export default Survivors;
