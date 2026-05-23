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
      className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[90%] max-w-5xl"
    >
      <div className="glass-navbar px-3 sm:px-4 md:px-6 py-2.5 md:py-3 flex items-center justify-between md:justify-center gap-3 sm:gap-4 md:gap-8 lg:gap-12">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 md:gap-3 group shrink-0 min-w-fit md:absolute md:left-1/2 md:-translate-x-1/2">
          <img src="/NHubX2.0.png" alt="NHubX Logo" className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 shadow-glow group-hover:animate-glow-pulse flex-shrink-0" />
          <div className="hidden xs:flex flex-col">
            <span className="font-bold text-base sm:text-lg md:text-xl tracking-tighter glow-text-primary leading-none">NHubX</span>
            <div className="hidden sm:block">
              <DigitalClock />
            </div>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6">
          {links.map((link) => (
            <Link 
              key={link.name}
              to={link.path}
              className={`text-xs lg:text-sm font-medium transition-colors hover:text-nhubx-glow-primary whitespace-nowrap ${
                location.pathname === link.path ? 'text-nhubx-glow-primary' : 'text-gray-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 md:absolute md:right-6">
          <Link to="/contact" className="hidden md:block">
            <button className="bg-nhubx-glow-primary text-white px-3 sm:px-4 lg:px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-glow hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
              Join Now
            </button>
          </Link>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-1.5 hover:text-nhubx-glow-primary transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-2 glass rounded-2xl overflow-hidden border border-white/10"
          >
            <div className="flex flex-col p-3 sm:p-4 gap-3">
              {links.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-xs sm:text-sm font-medium transition-colors hover:text-nhubx-glow-primary py-2 ${
                    location.pathname === link.path ? 'text-nhubx-glow-primary' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setIsOpen(false)} className="md:hidden">
                <button className="w-full bg-nhubx-glow-primary text-white py-2 rounded-full text-xs sm:text-sm font-bold shadow-glow hover:scale-105 active:scale-95 transition-all">
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
