import React, { createContext, useState, useCallback } from 'react';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const openModal = useCallback((project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  }, []);

  const openPreview = useCallback((url) => {
    setPreviewUrl(url);
    setIsPreviewOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setPreviewUrl(null);
    document.body.style.overflow = 'unset';
  }, []);

  return (
    <ProjectContext.Provider value={{ 
      selectedProject, 
      isModalOpen, 
      openModal, 
      closeModal,
      previewUrl,
      isPreviewOpen,
      openPreview,
      closePreview
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = React.useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};
