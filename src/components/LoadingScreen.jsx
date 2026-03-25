import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-nhubx-bg-primary flex flex-col items-center justify-center"
    >
      <div className="relative">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter animate-glitch mb-8"
        >
          NHUB<span className="text-nhubx-glow-primary">X</span>
        </motion.h1>
        
        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            className="absolute top-0 left-0 h-full bg-nhubx-glow-primary shadow-glow"
          />
        </div>
        
        <div className="mt-4 flex justify-between text-[10px] font-mono text-gray-500 tracking-widest">
          <span>INITIALIZING SYSTEMS...</span>
          <span>{Math.min(percent, 100)}%</span>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,60,0,0.05)_0%,transparent_70%)]" />
    </motion.div>
  );
};

export default LoadingScreen;
