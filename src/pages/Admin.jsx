import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  BarChart3,
  Settings,
  Layers,
  Mail,
  ShieldCheck,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import AdminLogin from '../components/AdminLogin';
import AdminAnalytics from '../components/AdminAnalytics';
import AdminProjectManager from '../components/AdminProjectManager';
import AdminContentEditor from '../components/AdminContentEditor';
import AdminMessages from '../components/AdminMessages';
import { fetchProjects } from '../firebase';

const Admin = () => {
  const { isAuthenticated, isAuthLoading, logout, user } = useAdmin();
  const [activeTab, setActiveTab] = useState('analytics');
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectsError, setProjectsError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoadingProjects(true);
    setProjectsError('');

    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects from Firestore in Admin:', error);
      setProjectsError('Projects could not be loaded. Check your connection and Firestore permissions.');
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadProjects();
  }, [isAuthenticated, loadProjects]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="w-10 h-10 text-nhubx-glow-primary animate-spin" />
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-gray-400">
          Verifying admin session
        </p>
      </div>
    );
  }

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
    <div className="min-h-screen text-white pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              Admin <span className="glow-text-primary">Dashboard</span>
            </h1>
            <p className="text-gray-400">Manage your portfolio, projects, and secure submissions</p>
          </div>
          <div className="w-full lg:w-auto flex items-center justify-between sm:justify-start gap-3 glass border border-white/10 rounded-2xl p-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border border-nhubx-glow-primary/40"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-nhubx-glow-primary/15 flex items-center justify-center">
                <ShieldCheck size={20} className="text-nhubx-glow-primary" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{user?.displayName || 'NHubX Admin'}</p>
              <p className="text-[11px] text-gray-400 truncate max-w-48">{user?.email}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Sign out"
              className="flex items-center gap-2 bg-red-500/15 hover:bg-red-500/25 disabled:opacity-50 border border-red-500/25 text-red-300 px-3 py-2 rounded-xl transition-all"
            >
              {isLoggingOut ? <Loader2 size={17} className="animate-spin" /> : <LogOut size={17} />}
              <span className="hidden sm:inline">Sign out</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          role="tablist"
          aria-label="Admin sections"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={isActive}
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
                  <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-nhubx-glow-primary" />
                  Loading project records...
                </div>
              ) : projectsError ? (
                <div className="glass rounded-2xl border border-red-500/20 p-8 text-center">
                  <p className="text-red-300 mb-4">{projectsError}</p>
                  <button
                    onClick={loadProjects}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2 text-sm font-semibold transition-colors"
                  >
                    <RefreshCw size={16} />
                    Try again
                  </button>
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
