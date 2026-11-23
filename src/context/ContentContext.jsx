import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultSiteContent, fetchSiteContent } from '../firebase';
import { useSiteTheme } from './useSiteTheme';

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const { theme, themeSetting } = useSiteTheme();
  const [content, setContent] = useState(defaultSiteContent);
  const [contentLoading, setContentLoading] = useState(true);

  const refreshContent = async () => {
    try {
      setContent(await fetchSiteContent());
    } catch (error) {
      console.error('Unable to load site content:', error);
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    refreshContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, contentLoading, refreshContent, theme, themeSetting }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within ContentProvider');
  return context;
};
