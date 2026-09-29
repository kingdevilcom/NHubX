import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultSiteContent, fetchSiteContent } from '../firebase';

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
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
    <ContentContext.Provider value={{ content, contentLoading, refreshContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within ContentProvider');
  return context;
};
