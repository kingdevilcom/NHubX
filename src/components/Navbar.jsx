import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import DigitalClock from './DigitalClock';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);
  const location = useLocation();
  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Developer', path: '/developer' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-3 md:top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.div 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 18, delay: 0.05 }}
        className="w-[96%] sm:w-[94%] md:w-[92%] max-w-7xl pointer-events-auto flex flex-col"
      >
        {/* Boxy-Rounded Glass Navbar Container */}
      <div className="glass-navbar px-3 sm:px-5 py-1.5 md:py-2 flex items-center justify-between shadow-lg border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 relative">
        
        {/* Left Side: Brand Logo & Navigation Links Grouped Together */}
        <div className="flex items-center gap-6 lg:gap-10">
          {/* Brand Logo & Clock */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 min-w-fit hover:opacity-95 transition-opacity">
            <div className="relative">
              <img 
                src="/NHubX2.0.png" 
                alt="NHubX Logo" 
                className="w-8 h-8 sm:w-9 h-9 shadow-md rounded-lg transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_0_12px_rgba(255,60,0,0.3)] border border-white/[0.08]" 
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-nhubx-glow-primary/0 group-hover:bg-nhubx-glow-primary/5 rounded-lg transition-all duration-300"></div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-xs sm:text-sm tracking-wide glow-text-primary leading-none uppercase font-mono">
                NHub<span className="text-white drop-shadow-none">X</span>
              </span>
              <div className="mt-0.5">
                <DigitalClock />
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation Links (Aligned next to the logo on the left side) */}
          <div 
            className="hidden md:flex items-center gap-0.5 bg-white/[0.01] border border-white/[0.04] p-0.5 rounded-lg shadow-inner"
            onMouseLeave={() => setHoveredPath(null)}
          >
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name}
                  to={link.path}
                  onMouseEnter={() => setHoveredPath(link.path)}
                  className={`relative px-3.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 whitespace-nowrap ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {/* Sliding transparent glassy hover capsule */}
                  {hoveredPath === link.path && !isActive && (
                    <motion.span
                      layoutId="hoverNavTab"
                      className="absolute inset-0 bg-white/[0.04] border border-white/[0.06] rounded-md z-0"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-nhubx-glow-primary/95 rounded-md shadow-[0_0_10px_rgba(255,60,0,0.3)] z-0"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side: Join CTA Button & Hamburger */}
        <div className="flex items-center gap-3">
          <Link to="/contact" className="hidden md:block">
            <motion.button 
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden group bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/95 text-white px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-md shadow-nhubx-glow-primary/10 active:scale-98 transition-all duration-300"
            >
              <span className="relative z-10">Join Now</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>
          </Link>
          
          {/* Hamburger button */}
          <motion.button 
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-gray-300 hover:text-nhubx-glow-primary p-2 hover:bg-white/5 rounded-lg border border-white/5 hover:border-nhubx-glow-primary/20 transition-all"
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden mt-1.5 glass rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#080808]/95 backdrop-blur-2xl"
          >
            <div className="flex flex-col p-3 gap-1">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      isActive 
                        ? 'text-nhubx-glow-primary bg-nhubx-glow-primary/5 border-nhubx-glow-primary/20 shadow-[inset_0_0_8px_rgba(255,60,0,0.05)]' 
                        : 'text-gray-300 border-transparent hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link to="/contact" onClick={() => setIsOpen(false)} className="pt-1.5">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/95 text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md shadow-nhubx-glow-primary/10 transition-all"
                >
                  Join Now
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </nav>
  );
};

export default Navbar;
