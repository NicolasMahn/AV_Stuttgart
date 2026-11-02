import React, { useEffect } from 'react';
import { useTab } from './menu/TabContext';

import './App.css';

const Kontakt = () => {
    const [currentTab, setCurrentTab] = useTab();

    useEffect(() => {
        setCurrentTab("Kontakt"); 
        return () => setCurrentTab("");
        }, [setCurrentTab]);


    return (
        <div>
            <h1>TODO</h1>
        </div>
    );
}

export default Kontakt;
