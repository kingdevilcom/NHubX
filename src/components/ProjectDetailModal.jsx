import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Cpu } from 'lucide-react';
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
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
          >
            <div className="glass-panel w-full max-w-md md:max-w-lg lg:max-w-2xl max-h-[85vh] md:max-h-[80vh] overflow-y-auto border border-white/[0.05] shadow-xl bg-black/60 backdrop-blur-xl relative rounded-xl">
              
              {/* Sticky Header with Close Button */}
              <div className="sticky top-0 right-0 p-4 flex justify-between items-center bg-white/[0.01] backdrop-blur-md border-b border-white/[0.03] z-10">
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  <Cpu size={12} className="text-nhubx-glow-primary animate-pulse" />
                  Telemetry Inspect
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md border border-white/5 hover:border-nhubx-glow-primary/20 hover:bg-white/5 text-gray-500 hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Project Icon and Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] flex-shrink-0">
                    {project.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide text-white">{project.name}</h2>
                      <span className="text-[8px] font-black px-2 py-0.5 rounded-lg border border-white/10 text-gray-400 tracking-wider uppercase">
                        {project.type}
                      </span>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                      project.status === 'LIVE' ? 'text-green-400' : 'text-nhubx-glow-secondary'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${project.status === 'LIVE' ? 'bg-green-500 animate-pulse' : 'bg-nhubx-glow-secondary'}`} />
                      System {project.status}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3">
                    {project.description}
                  </p>
                  {project.fullDescription && (
                    <p className="text-gray-500 text-xs leading-relaxed border-l border-nhubx-glow-primary/20 pl-3 py-0.5">
                      {project.fullDescription}
                    </p>
                  )}
                </div>

                {/* Features */}
                {project.features && project.features.length > 0 && (
                  <div className="mb-6 bg-white/[0.01] border border-white/[0.03] p-4 rounded-lg">
                    <h3 className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2 font-mono">Capabilities</h3>
                    <ul className="grid gap-1.5">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                          <span className="text-nhubx-glow-primary font-bold">▸</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2 font-mono">Technologies</h3>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05] text-[9px] font-bold text-gray-500 uppercase tracking-widest cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Call to Action */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-white/[0.03]">
                  <motion.button 
                    onClick={() => openPreview(project.link)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/95 text-white font-bold py-2.5 rounded-lg transition-all shadow-glow hover:shadow-glow-lg active:scale-98 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider"
                  >
                    <span>Preview</span>
                    <ExternalLink size={10} />
                  </motion.button>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <motion.button 
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white font-bold py-2.5 rounded-lg transition-all active:scale-98 text-[10px] uppercase tracking-wider"
                    >
                      Visit Production
                    </motion.button>
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
