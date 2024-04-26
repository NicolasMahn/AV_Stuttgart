import React, { useEffect } from 'react';
import { useTab } from './menu/TabContext';

import './App.css';

const Spenden = () => {
    const [currentTab, setCurrentTab] = useTab();

    useEffect(() => {
        setCurrentTab("Spenden"); 
        return () => setCurrentTab("");
        }, [setCurrentTab]);


    return (
        <div>
            <h1>TODO</h1>
        </div>
    );
}

export default Spenden;
