import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

const AdminProjectManager = ({ projects, setProjects }) => {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fullDescription: '',
    status: 'DEV',
    type: 'personal',
    link: '',
    features: [],
    technologies: []
  });
  const [featureInput, setFeatureInput] = useState('');
  const [techInput, setTechInput] = useState('');

  const handleAddProject = () => {
    if (formData.name && formData.description) {
      const newProject = {
        ...formData,
        id: Date.now()
      };
      setProjects([...projects, newProject]);
      resetForm();
    }
  };

  const handleUpdateProject = (id) => {
    setProjects(projects.map(p => p.id === id ? formData : p));
    resetForm();
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleEditProject = (project) => {
    setFormData(project);
    setEditingId(project.id);
    setIsAddingProject(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      fullDescription: '',
      status: 'DEV',
      type: 'personal',
      link: '',
      features: [],
      technologies: []
    });
    setEditingId(null);
    setIsAddingProject(false);
    setFeatureInput('');
    setTechInput('');
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput]
      });
      setFeatureInput('');
    }
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput]
      });
      setTechInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Project Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => {
          resetForm();
          setIsAddingProject(true);
        }}
        className="flex items-center gap-2 bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/80 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-glow hover:scale-105 active:scale-95"
      >
        <Plus size={20} />
        Add New Project
      </motion.button>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {isAddingProject && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl border border-white/10 p-6 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={resetForm}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-nhubx-glow-primary/50"
                />
                <input
                  type="text"
                  placeholder="Project Link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-nhubx-glow-primary/50"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-nhubx-glow-primary/50"
                >
                  <option value="LIVE">LIVE</option>
                  <option value="DEV">DEV</option>
                </select>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-nhubx-glow-primary/50"
                >
                  <option value="personal">Personal</option>
                  <option value="client">Client</option>
                </select>
              </div>

              {/* Descriptions */}
              <textarea
                placeholder="Short Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-nhubx-glow-primary/50 resize-none"
                rows="2"
              />
              <textarea
                placeholder="Full Description"
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-nhubx-glow-primary/50 resize-none"
                rows="3"
              />

              {/* Features */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a feature"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-nhubx-glow-primary/50"
                  />
                  <button
                    onClick={addFeature}
                    className="bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/80 px-4 py-2 rounded-lg font-bold transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="bg-nhubx-glow-primary/20 border border-nhubx-glow-primary/30 rounded-lg px-3 py-1 text-sm flex items-center gap-2">
                      {feature}
                      <button
                        onClick={() => setFormData({
                          ...formData,
                          features: formData.features.filter((_, i) => i !== idx)
                        })}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Technologies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a technology"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-nhubx-glow-primary/50"
                  />
                  <button
                    onClick={addTechnology}
                    className="bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/80 px-4 py-2 rounded-lg font-bold transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, idx) => (
                    <div key={idx} className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-1 text-sm flex items-center gap-2">
                      {tech}
                      <button
                        onClick={() => setFormData({
                          ...formData,
                          technologies: formData.technologies.filter((_, i) => i !== idx)
                        })}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => editingId ? handleUpdateProject(editingId) : handleAddProject()}
                  className="flex-1 bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/80 text-white px-6 py-2 rounded-lg font-bold transition-all"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {projects.map((project, idx) => (
          <motion.div
            key={project.id || idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl border border-white/10 p-4 flex items-center justify-between group hover:border-nhubx-glow-primary/50 transition-all"
          >
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">{project.name}</h4>
              <p className="text-gray-400 text-sm line-clamp-1">{project.description}</p>
              <div className="flex gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  project.status === 'LIVE'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {project.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  project.type === 'personal'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-purple-500/20 text-purple-300'
                }`}>
                  {project.type}
                </span>
              </div>
            </div>
            <div className="flex gap-2 group-hover:opacity-100">
              <button
                onClick={() => handleEditProject(project)}
                className="p-2 hover:bg-nhubx-glow-primary/20 rounded-lg transition-colors"
              >
                <Edit2 size={18} className="text-nhubx-glow-primary" />
              </button>
              <button
                onClick={() => handleDeleteProject(project.id || idx)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <Trash2 size={18} className="text-red-400" />
              </button>
            </div>
          </motion.div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No projects yet. Create your first one!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminProjectManager;
