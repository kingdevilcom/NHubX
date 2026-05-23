import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('nhubx@admin123');

  // Check authentication on mount
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken && adminToken === adminPassword) {
      setIsAuthenticated(true);
    }
  }, [adminPassword]);

  const login = useCallback((password) => {
    if (password === adminPassword) {
      localStorage.setItem('adminToken', password);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, [adminPassword]);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  }, []);

  const changePassword = useCallback((newPassword) => {
    setAdminPassword(newPassword);
    localStorage.setItem('adminToken', newPassword);
  }, []);

  return (
    <AdminContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      changePassword,
      adminPassword
    }}>
      {children}
    </AdminContext.Provider>
  );
};
