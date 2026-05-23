import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const ProjectDetailModal = ({ isOpen, project, onClose }) => {
  const { openPreview } = useProject();

  return (
    <AnimatePresence>
      {isOpen && project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          >
            <div className="glass-panel w-full max-w-md md:max-w-lg lg:max-w-2xl max-h-[85vh] md:max-h-[80vh] overflow-y-auto rounded-2xl border border-white/20 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="sticky top-0 right-0 float-right p-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>

              {/* Content */}
              <div className="px-6 md:px-8 pt-0 pb-8">
                {/* Project Icon and Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    {project.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl md:text-3xl font-bold">{project.name}</h2>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        project.type === 'personal'
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                          : 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      }`}>
                        {project.type === 'personal' ? 'Personal' : 'Client'}
                      </span>
                    </div>
                    <p className="text-nhubx-glow-primary text-sm font-semibold">{project.status}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <p className="text-gray-300 text-base leading-relaxed mb-4">
                    {project.description}
                  </p>
                  {project.fullDescription && (
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {project.fullDescription}
                    </p>
                  )}
                </div>

                {/* Features */}
                {project.features && project.features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-white">Key Features</h3>
                    <ul className="grid gap-2">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-400 flex items-start gap-3">
                          <span className="text-nhubx-glow-primary mt-1">▸</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-white">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:border-nhubx-glow-primary/50 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Call to Action */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => openPreview(project.link)}
                    className="flex-1 bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/80 text-white font-bold py-3 rounded-lg transition-all shadow-glow hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Preview</span>
                    <ExternalLink size={16} />
                  </button>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 rounded-lg transition-all hover:scale-105 active:scale-95">
                      Visit Live
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
