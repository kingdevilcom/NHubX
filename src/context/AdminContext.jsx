import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const ADMIN_EMAIL = 'stharunindu@gmail.com';

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
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      const isAdmin = firebaseUser?.email?.toLowerCase() === ADMIN_EMAIL;

      if (firebaseUser && !isAdmin) {
        await signOut(auth);
        setUser(null);
        setIsAuthenticated(false);
      } else {
        setUser(firebaseUser);
        setIsAuthenticated(Boolean(isAdmin));
      }

      setIsAuthLoading(false);
    });
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const email = result.user.email?.toLowerCase();

    if (email !== ADMIN_EMAIL) {
      await signOut(auth);
      throw new Error('This Google account is not authorized.');
    }

    return result.user;
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <AdminContext.Provider value={{ 
      isAuthenticated, 
      loginWithGoogle,
      logout, 
      isAuthLoading,
      user
    }}>
      {children}
    </AdminContext.Provider>
  );
};
