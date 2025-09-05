import React, { createContext, useState, useContext, useCallback } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import CustomAlert from '../components/CustomAlert';

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '' });

  const showLoading = useCallback(() => setLoading(true), []);
  const hideLoading = useCallback(() => setLoading(false), []);

  const showAlert = useCallback((message) => setAlert({ show: true, message }), []);
  const hideAlert = useCallback(() => setAlert({ show: false, message: '' }), []);

  const value = { showLoading, hideLoading, showAlert, hideAlert };

  return (
    <UIContext.Provider value={value}>
      {children}
      {loading && <LoadingSpinner />}
      {alert.show && <CustomAlert message={alert.message} onOk={hideAlert} />}
    </UIContext.Provider>
  );
};
