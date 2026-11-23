import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FireParticles from './FireParticles';

export default function LoadingScreen({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const started = performance.now();
    const duration = reduceMotion ? 450 : 1500;
    const target = onComplete ? 100 : 90;
    const interval = window.setInterval(() => {
      const progress = Math.min(target, Math.floor((performance.now() - started) / duration * 10) * 10);
      setPercent(progress);
      if (progress === target) window.clearInterval(interval);
    }, reduceMotion ? 75 : 150);

    const finish = onComplete && window.setTimeout(onComplete, duration + (reduceMotion ? 100 : 500));
    return () => {
      window.clearInterval(interval);
      if (finish) window.clearTimeout(finish);
    };
  }, [onComplete, reduceMotion]);

  return (
    <motion.div role="status" aria-label="Loading NHubX" exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-nhubx-bg-primary flex flex-col items-center justify-center">
      <FireParticles zIndex={1} />
      <div className="relative z-10" aria-hidden="true">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter animate-glitch mb-8"
        >
          NHUB<span className="text-nhubx-glow-primary">X</span>
        </motion.p>
        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div
            animate={{ width: percent + '%' }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.15 }}
            className="absolute top-0 left-0 h-full bg-nhubx-glow-primary shadow-glow"
          />
        </div>
        <div className="mt-4 flex justify-between text-[10px] font-mono text-gray-500 tracking-widest">
          <span>INITIALIZING SYSTEMS...</span>
          <span>{percent}%</span>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgb(var(--fire-primary)/0.05)_0%,transparent_70%)]" />
    </motion.div>
  );
}
