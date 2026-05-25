import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, BarChart3, Settings, Layers, Mail } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import AdminLogin from '../components/AdminLogin';
import AdminAnalytics from '../components/AdminAnalytics';
import AdminProjectManager from '../components/AdminProjectManager';
import AdminContentEditor from '../components/AdminContentEditor';
import AdminMessages from '../components/AdminMessages';
import { fetchProjects } from '../firebase';

const Admin = () => {
  const { isAuthenticated, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState('analytics');
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Load projects from Firestore on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadProjects = async () => {
      setLoadingProjects(true);
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects from Firestore in Admin:", error);
      } finally {
        setLoadingProjects(false);
      }
    };
    loadProjects();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setActiveTab('analytics')} />;
  }

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'content', label: 'Content', icon: Settings }
  ];

  return (
    <div className="min-h-screen text-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              Admin <span className="glow-text-primary">Dashboard</span>
            </h1>
            <p className="text-gray-400">Manage your portfolio, projects, and secure submissions</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-all"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? 'bg-nhubx-glow-primary text-white shadow-glow'
                    : 'glass border border-white/10 text-gray-300 hover:border-nhubx-glow-primary/50'
                }`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'analytics' && <AdminAnalytics />}
            {activeTab === 'projects' && (
              loadingProjects ? (
                <div className="text-center py-12 text-gray-400 font-mono">
                  Loading project records...
                </div>
              ) : (
                <AdminProjectManager projects={projects} setProjects={setProjects} />
              )
            )}
            {activeTab === 'messages' && <AdminMessages />}
            {activeTab === 'content' && <AdminContentEditor />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
