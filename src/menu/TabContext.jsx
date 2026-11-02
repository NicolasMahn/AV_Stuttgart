import React, { createContext, useContext, useState } from 'react';

const TabContext = createContext();

export const useTab = () => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTab must be used within a TabProvider');
  }
  return context;
};

export const TabProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState("");
  return (
    <TabContext.Provider value={[currentTab, setCurrentTab]}>
      {children}
    </TabContext.Provider>
  );
};
