import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Home = () => {
  const { content } = useContent();
  useEffect(() => { document.title = 'NHubX | Modern Digital Solutions'; }, []);

  return (
    <div className="relative min-h-screen flex items-center px-4 sm:px-6 pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(255,60,0,0.07),transparent_45%)]" />
      <div className="relative max-w-5xl mx-auto w-full text-center">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-nhubx-glow-primary mb-6">Websites · Applications · Digital systems</p>
        <h1 className="text-6xl sm:text-8xl lg:text-[9rem] font-black tracking-[-0.075em] uppercase leading-[0.82] text-white">
          {content.heroTitle.slice(0, -1)}<span className="text-nhubx-glow-primary">{content.heroTitle.slice(-1)}</span>
        </h1>
        <p className="mt-8 text-xl sm:text-2xl text-gray-300 font-medium">{content.heroSubtitle}</p>
        <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-gray-500">Affordable custom websites and connected digital products for Sri Lankan individuals and businesses.</p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/pricing" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-nhubx-glow-primary hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-colors">View pricing <ArrowRight size={16} /></Link>
          <Link to="/projects" className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-white text-xs font-bold uppercase tracking-wider transition-colors">Explore projects</Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs text-gray-500">
          {['Custom design', 'Responsive build', 'Clear pricing'].map((item) => <span key={item} className="inline-flex items-center gap-2"><Check size={14} className="text-nhubx-glow-primary" />{item}</span>)}
        </div>
        <p className="mt-8 text-xs text-gray-600">Custom one-page websites starting from <span className="text-gray-300 font-semibold">LKR 4,999</span></p>
      </div>
    </div>
  );
};

export default Home;
