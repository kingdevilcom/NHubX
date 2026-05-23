import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

const AdminContentEditor = () => {
  const [content, setContent] = useState({
    aboutTitle: 'About Me',
    aboutDescription: 'Passionate developer creating innovative solutions',
    socialLinks: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      email: 'contact@nhubx.com'
    },
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS'],
    heroTitle: 'Welcome to NHubX',
    heroSubtitle: 'One Hub. Infinite Power.'
  });

  const [skillInput, setSkillInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('portfolioContent', JSON.stringify(content));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setContent({
        ...content,
        skills: [...content.skills, skillInput]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (idx) => {
    setContent({
      ...content,
      skills: content.skills.filter((_, i) => i !== idx)
    });
  };

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
      {/* Save Notification */}
      {isSaved && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <p className="text-green-300 font-medium">Content saved successfully!</p>
        </motion.div>
      )}

      {/* Hero Section */}
      <motion.div variants={item} className="glass rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-bold mb-6">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Hero Title</label>
            <input
              type="text"
              value={content.heroTitle}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-nhubx-glow-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Hero Subtitle</label>
            <input
              type="text"
              value={content.heroSubtitle}
              onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-nhubx-glow-primary/50"
            />
          </div>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div variants={item} className="glass rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-bold mb-6">About Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">About Title</label>
            <input
              type="text"
              value={content.aboutTitle}
              onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-nhubx-glow-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">About Description</label>
            <textarea
              value={content.aboutDescription}
              onChange={(e) => setContent({ ...content, aboutDescription: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-nhubx-glow-primary/50 resize-none"
              rows="4"
            />
          </div>
        </div>
      </motion.div>

      {/* Skills Section */}
      <motion.div variants={item} className="glass rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-bold mb-6">Skills</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a new skill"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-nhubx-glow-primary/50"
            />
            <button
              onClick={addSkill}
              className="bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/80 px-4 py-2 rounded-lg font-bold transition-all"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-nhubx-glow-primary/20 border border-nhubx-glow-primary/30 rounded-lg px-4 py-2 flex items-center gap-2"
              >
                {skill}
                <button
                  onClick={() => removeSkill(idx)}
                  className="ml-2 hover:text-red-400 transition-colors text-xs"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div variants={item} className="glass rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-bold mb-6">Social Links</h3>
        <div className="space-y-4">
          {Object.entries(content.socialLinks).map(([platform, url]) => (
            <div key={platform}>
              <label className="block text-sm text-gray-300 mb-2 capitalize">{platform}</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setContent({
                  ...content,
                  socialLinks: { ...content.socialLinks, [platform]: e.target.value }
                })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-nhubx-glow-primary/50"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.button
        variants={item}
        onClick={handleSave}
        className="w-full bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/80 text-white font-bold py-3 rounded-xl transition-all shadow-glow hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
      >
        <Save size={20} />
        Save All Changes
      </motion.button>
    </motion.div>
  );
};

export default AdminContentEditor;
