import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Card from '../components/Card';
import { Shield, EyeOff, Zap, Server } from 'lucide-react';

const About = () => {

  useEffect(() => {
    document.title = "About | NHubX";
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-nhubx-glow-primary/[0.02] blur-[120px] rounded-full -z-10 animate-glow-pulse" />
      <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] bg-purple-500/[0.01] blur-[120px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-3xl"
        >

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.02] border border-white/[0.06] text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 font-mono">
            NHubX Protocol
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-white mb-6">
            About <span className="glow-text-primary">NHubX</span>
          </h1>

          <p className="text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed">
            NHubX is a modern development and cyber solutions platform focused on fast, secure, and scalable systems.
            We build premium websites, smart dashboards, automation systems, and security-focused digital experiences.
          </p>

        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">

          <Card delay={0.05} className="bg-white/[0.01] border-white/[0.04]">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-nhubx-glow-primary/[0.06] border border-nhubx-glow-primary/10 flex items-center justify-center text-nhubx-glow-primary">
                <Server size={18} />
              </div>

              <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                What We Build
              </h3>

            </div>

            <p className="text-gray-500 leading-relaxed text-sm">
              From business websites and admin dashboards to advanced security tools and automation systems,
              NHubX focuses on creating clean, high-performance digital products built for modern businesses and creators.
            </p>

          </Card>

          <Card delay={0.1} className="bg-white/[0.01] border-white/[0.04]">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-nhubx-glow-primary/[0.06] border border-nhubx-glow-primary/10 flex items-center justify-center text-nhubx-glow-primary">
                <Shield size={18} />
              </div>

              <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                Our Mission
              </h3>

            </div>

            <p className="text-gray-500 leading-relaxed text-sm">
              We believe technology should feel powerful, smooth, and secure.
              Our goal is to help startups, creators, and businesses launch modern systems without complexity.
            </p>

          </Card>

        </div>

        {/* Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >

          <div className="text-[10px] font-bold text-nhubx-glow-primary uppercase tracking-widest font-mono mb-2">
            Core Features
          </div>

          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Why NHubX
          </h2>

        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">

          <Card
            delay={0.05}
            className="bg-white/[0.01] border-white/[0.04] p-6 text-center flex flex-col items-center"
          >

            <div className="w-10 h-10 rounded-xl bg-nhubx-glow-primary/[0.06] border border-nhubx-glow-primary/10 flex items-center justify-center text-nhubx-glow-primary mb-4">
              <EyeOff size={18} />
            </div>

            <h4 className="font-bold text-sm uppercase tracking-wider mb-2 text-white">
              Secure Systems
            </h4>

            <p className="text-gray-500 text-xs leading-relaxed">
              Security-first development with modern authentication and protected infrastructures.
            </p>

          </Card>

          <Card
            delay={0.1}
            className="bg-white/[0.01] border-white/[0.04] p-6 text-center flex flex-col items-center"
          >

            <div className="w-10 h-10 rounded-xl bg-nhubx-glow-primary/[0.06] border border-nhubx-glow-primary/10 flex items-center justify-center text-nhubx-glow-primary mb-4">
              <Zap size={18} />
            </div>

            <h4 className="font-bold text-sm uppercase tracking-wider mb-2 text-white">
              Fast Performance
            </h4>

            <p className="text-gray-500 text-xs leading-relaxed">
              Optimized with React and Vite for ultra-smooth animations and blazing fast load speeds.
            </p>

          </Card>

          <Card
            delay={0.15}
            className="bg-white/[0.01] border-white/[0.04] p-6 text-center flex flex-col items-center"
          >

            <div className="w-10 h-10 rounded-xl bg-nhubx-glow-primary/[0.06] border border-nhubx-glow-primary/10 flex items-center justify-center text-nhubx-glow-primary mb-4">
              <Server size={18} />
            </div>

            <h4 className="font-bold text-sm uppercase tracking-wider mb-2 text-white">
              Scalable Design
            </h4>

            <p className="text-gray-500 text-xs leading-relaxed">
              Flexible architecture built to grow from small projects into powerful platforms.
            </p>

          </Card>

        </div>

      </div>
    </div>
  );
};

export default About;
