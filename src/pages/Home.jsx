import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Braces, Database, ShieldCheck, Sparkles } from 'lucide-react';
import Card from '../components/Card';
import { useContent } from '../context/ContentContext';

const capabilities = [
  { icon: Braces, title: 'Web Applications', text: 'Responsive React experiences designed around real product goals.' },
  { icon: Database, title: 'Connected Systems', text: 'Firebase-backed dashboards, content, authentication, and live data.' },
  { icon: ShieldCheck, title: 'Secure by Design', text: 'Access controls and practical security built into each workflow.' }
];

const Home = () => {
  const { content } = useContent();

  useEffect(() => { document.title = 'NHubX | Modern Digital Solutions'; }, []);

  return (
    <div className="relative overflow-hidden">
      <section className="relative min-h-screen flex items-start justify-center px-4 sm:px-6 pt-36 sm:pt-40 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full bg-nhubx-glow-primary/[0.08] blur-[140px]" />
          <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-nhubx-glow-primary/20 bg-nhubx-glow-primary/[0.06] px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-orange-200 mb-8">
            <Sparkles size={14} className="text-nhubx-glow-primary" />
            Design · Development · Secure Systems
          </div>

          <h1 className="text-6xl sm:text-8xl lg:text-[9rem] font-black tracking-[-0.075em] uppercase leading-[0.8] text-white">
            {content.heroTitle.slice(0, -1)}<span className="text-nhubx-glow-primary drop-shadow-[0_0_30px_rgba(255,60,0,.6)]">{content.heroTitle.slice(-1)}</span>
          </h1>
          <p className="mt-8 text-xl sm:text-2xl text-gray-300 font-medium">{content.heroSubtitle}</p>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-gray-500">
            Modern websites, connected applications, automation, and security-minded digital products—built as one focused experience.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/projects" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-nhubx-glow-primary hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-glow hover:shadow-glow-lg transition-all">
              Explore projects <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-white/10 bg-white/[0.025] hover:bg-white/[0.06] hover:border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all">
              Start a conversation
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-3 max-w-xl mx-auto border-y border-white/[0.06] py-5">
            <div><p className="text-lg sm:text-2xl font-bold text-white">React</p><p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-600">Interfaces</p></div>
            <div className="border-x border-white/[0.06]"><p className="text-lg sm:text-2xl font-bold text-white">Firebase</p><p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-600">Live data</p></div>
            <div><p className="text-lg sm:text-2xl font-bold text-white">Secure</p><p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-600">Access</p></div>
          </div>
        </motion.div>
      </section>

      <section className="relative px-4 sm:px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div><p className="text-nhubx-glow-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">What NHubX delivers</p><h2 className="text-3xl sm:text-5xl font-black tracking-tight">From idea to working system.</h2></div>
            <Link to="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors">How we approach projects <ArrowRight size={16} /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {capabilities.map(({ icon: Icon, title, text }, index) => <Card key={title} delay={index * 0.08} className="group min-h-56"><div className="w-11 h-11 rounded-xl bg-nhubx-glow-primary/10 border border-nhubx-glow-primary/15 flex items-center justify-center mb-8 group-hover:bg-nhubx-glow-primary/20 transition-colors"><Icon size={21} className="text-nhubx-glow-primary" /></div><h3 className="text-xl font-bold mb-3">{title}</h3><p className="text-sm leading-relaxed text-gray-500">{text}</p></Card>)}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-24">
        <div className="max-w-6xl mx-auto rounded-3xl border border-nhubx-glow-primary/15 bg-gradient-to-br from-nhubx-glow-primary/[0.10] via-white/[0.025] to-transparent p-8 sm:p-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8 overflow-hidden relative">
          <div className="absolute -right-24 -top-24 w-72 h-72 bg-nhubx-glow-primary/10 blur-3xl rounded-full" />
          <div className="relative"><p className="text-xs font-bold uppercase tracking-[0.2em] text-nhubx-glow-primary mb-3">Build with NHubX</p><h2 className="text-3xl sm:text-5xl font-black max-w-2xl">Have an idea that needs a strong digital foundation?</h2><p className="text-gray-500 mt-4 max-w-xl">Tell us what you want to build. We’ll turn the goal into a focused product plan.</p></div>
          <Link to="/contact" className="relative shrink-0 inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white text-black hover:bg-orange-50 text-xs font-black uppercase tracking-wider transition-colors">Contact NHubX <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
