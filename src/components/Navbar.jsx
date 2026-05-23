import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import DigitalClock from './DigitalClock';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Developer', path: '/developer' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[92%] md:w-[90%] max-w-6xl"
    >
      <div className="glass-navbar px-4 sm:px-6 md:px-8 py-3 md:py-4 flex items-center justify-between md:justify-center gap-4 sm:gap-6 md:gap-12 lg:gap-16 shadow-lg border border-white/20 hover:border-white/30 transition-all duration-300">
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 md:gap-3 group shrink-0 min-w-fit hover:opacity-90 transition-opacity">
          <div className="relative">
            <img src="/NHubX2.0.png" alt="NHubX Logo" className="w-10 h-10 sm:w-11 sm:h-11 md:w-13 md:h-13 shadow-lg group-hover:shadow-glow flex-shrink-0 rounded-lg transition-all duration-300" />
            <div className="absolute inset-0 bg-nhubx-glow-primary/0 group-hover:bg-nhubx-glow-primary/10 rounded-lg transition-all duration-300"></div>
          </div>
          <div className="hidden sm:flex flex-col justify-center">
            <span className="font-bold text-base sm:text-lg md:text-xl tracking-tight glow-text-primary leading-tight">NHubX</span>
            <div className="hidden md:block -mt-1">
              <DigitalClock />
            </div>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center justify-center gap-2 lg:gap-3">
          {links.map((link) => (
            <Link 
              key={link.name}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-nhubx-glow-primary hover:bg-white/5 whitespace-nowrap ${
                location.pathname === link.path 
                  ? 'text-nhubx-glow-primary bg-nhubx-glow-primary/10 border border-nhubx-glow-primary/30' 
                  : 'text-gray-300 hover:text-nhubx-glow-primary'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link to="/contact" className="hidden md:block">
            <button className="bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-nhubx-glow-primary/50 hover:shadow-nhubx-glow-primary/80 active:scale-95 transition-all whitespace-nowrap">
              Join Now
            </button>
          </Link>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-nhubx-glow-primary p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-3 glass rounded-2xl overflow-hidden border border-white/20 shadow-lg"
          >
            <div className="flex flex-col p-4 gap-2">
              {links.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path 
                      ? 'text-nhubx-glow-primary bg-nhubx-glow-primary/10 border border-nhubx-glow-primary/30' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-nhubx-glow-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setIsOpen(false)} className="md:hidden pt-2">
                <button className="w-full bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/90 text-white py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-nhubx-glow-primary/50 transition-all">
                  Join Now
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
