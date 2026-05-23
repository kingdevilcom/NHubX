import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Eye, Clock } from 'lucide-react';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalVisitors: 1247,
    totalViews: 5892,
    projectViews: {
      'Prof Helper': 542,
      'NClockX': 687,
      'NAuthX': 234,
      'NPassX': 189,
      'NNetX': 156
    },
    dailyStats: [
      { day: 'Mon', views: 450 },
      { day: 'Tue', views: 520 },
      { day: 'Wed', views: 480 },
      { day: 'Thu', views: 620 },
      { day: 'Fri', views: 740 },
      { day: 'Sat', views: 890 },
      { day: 'Sun', views: 710 }
    ]
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Visitors */}
        <motion.div variants={item} className="glass rounded-2xl border border-white/10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Visitors</p>
              <p className="text-3xl font-bold text-white">{stats.totalVisitors.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-green-400 text-xs font-medium">↑ 12% from last month</p>
        </motion.div>

        {/* Total Views */}
        <motion.div variants={item} className="glass rounded-2xl border border-white/10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Views</p>
              <p className="text-3xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Eye className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-green-400 text-xs font-medium">↑ 8% from last month</p>
        </motion.div>

        {/* Avg. Daily Views */}
        <motion.div variants={item} className="glass rounded-2xl border border-white/10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Avg. Daily Views</p>
              <p className="text-3xl font-bold text-white">{Math.round(stats.totalViews / 7)}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-gray-400 text-xs">Last 7 days average</p>
        </motion.div>

        {/* Engagement Rate */}
        <motion.div variants={item} className="glass rounded-2xl border border-white/10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Engagement</p>
              <p className="text-3xl font-bold text-white">
                {Math.round((stats.totalViews / (stats.totalVisitors * 5)) * 100)}%
              </p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="text-gray-400 text-xs">Avg views per visitor</p>
        </motion.div>
      </div>

      {/* Project Views */}
      <motion.div variants={item} className="glass rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-nhubx-glow-primary" />
          Project Views
        </h3>
        <div className="space-y-4">
          {Object.entries(stats.projectViews).map(([project, views], idx) => {
            const maxViews = Math.max(...Object.values(stats.projectViews));
            const percentage = (views / maxViews) * 100;

            return (
              <motion.div key={project} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">{project}</span>
                  <span className="text-sm font-bold text-nhubx-glow-primary">{views}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="h-full bg-gradient-to-r from-nhubx-glow-primary to-nhubx-glow-secondary"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Daily Chart */}
      <motion.div variants={item} className="glass rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-nhubx-glow-primary" />
          Last 7 Days Activity
        </h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {stats.dailyStats.map((stat, idx) => {
            const maxViews = Math.max(...stats.dailyStats.map(s => s.views));
            const heightPercent = (stat.views / maxViews) * 100;

            return (
              <motion.div
                key={stat.day}
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="flex-1 flex flex-col items-center"
              >
                <div className="w-full bg-gradient-to-t from-nhubx-glow-primary to-nhubx-glow-primary/50 rounded-t-lg hover:from-nhubx-glow-secondary hover:to-nhubx-glow-secondary/50 transition-all cursor-pointer group relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap">
                    {stat.views}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{stat.day}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminAnalytics;
