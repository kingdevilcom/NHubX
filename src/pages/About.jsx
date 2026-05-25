import { motion } from 'framer-motion';
import Card from '../components/Card';
import { Shield, EyeOff, Zap, Server } from 'lucide-react';

const About = () => {
  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-nhubx-glow-primary/[0.02] blur-[120px] rounded-full -z-10 animate-glow-pulse" />
      <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] bg-purple-500/[0.01] blur-[120px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* Title and Intro */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.02] border border-white/[0.06] text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 font-mono">
            Genesis Version 2.0
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight leading-none text-white">
            About <span className="glow-text-primary">NHubX</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed">
            Innovating at the intersection of network security and decentralized nodes. NHubX is a streamlined cockpit engineered for developers who command absolute sovereignty.
          </p>
        </motion.div>

        {/* Two-Column Detail Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <Card delay={0.05} className="bg-white/[0.01] border-white/[0.04]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-nhubx-glow-primary/[0.06] border border-nhubx-glow-primary/10 flex items-center justify-center text-nhubx-glow-primary">
                <Server size={16} />
              </div>
              <h3 className="text-base sm:text-lg font-bold tracking-wide uppercase text-white">What is NHubX?</h3>
            </div>
            <p className="text-gray-500 leading-relaxed text-xs sm:text-sm">
              NHubX is a centralized control panel for security frameworks and distributed nodes. From zero-knowledge password generators and biometric multi-factor authentication tools to robust WireGuard networks, we establish the infrastructure for a sovereign web.
            </p>
          </Card>

          <Card delay={0.1} className="bg-white/[0.01] border-white/[0.04]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-nhubx-glow-primary/[0.06] border border-nhubx-glow-primary/10 flex items-center justify-center text-nhubx-glow-primary">
                <Shield size={16} />
              </div>
              <h3 className="text-base sm:text-lg font-bold tracking-wide uppercase text-white">Our Core Purpose</h3>
            </div>
            <p className="text-gray-500 leading-relaxed text-xs sm:text-sm">
              Complexity is the enemy of security. Our ultimate goal is to crystallize complex data pipes into a responsive, unified digital cockpit. By integrating critical secure utilities under one premium interface, we empower professionals to deploy assets faster and safer than ever.
            </p>
          </Card>
        </div>

        {/* Genesis Pillars */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-[9px] font-bold text-nhubx-glow-primary uppercase tracking-widest font-mono mb-2">Our Operating Protocol</div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Genesis Pillars</h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          <Card delay={0.05} className="bg-white/[0.01] border-white/[0.04] p-6 text-center flex flex-col items-center">
            <div className="w-9 h-9 rounded-lg bg-nhubx-glow-primary/[0.06] border border-nhubx-glow-primary/10 flex items-center justify-center text-nhubx-glow-primary mb-4">
              <EyeOff size={16} />
            </div>
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider mb-2 text-white">Absolute Privacy</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              We leverage zero-knowledge handshakes and peer encryption so that data remains yours. Always.
            </p>
          </Card>

          <Card delay={0.1} className="bg-white/[0.01] border-white/[0.04] p-6 text-center flex flex-col items-center">
            <div className="w-9 h-9 rounded-lg bg-nhubx-glow-primary/[0.06] border border-nhubx-glow-primary/10 flex items-center justify-center text-nhubx-glow-primary mb-4">
              <Zap size={16} />
            </div>
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider mb-2 text-white">Obsidian Speed</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Built on React 19 and Vite for sub-second reactive latency and fluid transition velocities.
            </p>
          </Card>

          <Card delay={0.15} className="bg-white/[0.01] border-white/[0.04] p-6 text-center flex flex-col items-center">
            <div className="w-9 h-9 rounded-lg bg-nhubx-glow-primary/[0.06] border border-nhubx-glow-primary/10 flex items-center justify-center text-nhubx-glow-primary mb-4">
              <Server size={16} />
            </div>
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider mb-2 text-white">Distributed Power</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              No central server failures. We run federated nodes across resilient mesh pathways.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default About;
