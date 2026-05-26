import React, { createContext, useContext, useState, useCallback } from 'react';

const DebugContext = createContext(null);

export const DebugProvider = ({ children }) => {
  const [debugData, setDebugData] = useState({});
  const [isEnabled, setIsEnabled] = useState(false);

  const updateDebugInfo = useCallback((id, info) => {
    setDebugData(prev => ({
      ...prev,
      [id]: info
    }));
  }, []);

  return (
    <DebugContext.Provider value={{ debugData, updateDebugInfo, isEnabled, setIsEnabled }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) throw new Error('useDebug must be used within a DebugProvider');
  return context;
};
