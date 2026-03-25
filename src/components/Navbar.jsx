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
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl"
    >
      <div className="glass-navbar px-4 md:px-6 py-2 md:py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
          <img src="/logo.jpg" alt="NHubX Logo" className="w-8 h-8 rounded-full shadow-glow group-hover:animate-glow-pulse" />
          <div className="flex flex-col">
            <span className="font-bold text-lg md:text-xl tracking-tighter glow-text-primary leading-none">NHubX</span>
            <DigitalClock />
          </div>
        </Link>
        
        <div className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <Link 
              key={link.name}
              to={link.path}
              className={`text-xs font-medium transition-colors hover:text-nhubx-glow-primary whitespace-nowrap ${
                location.pathname === link.path ? 'text-nhubx-glow-primary' : 'text-gray-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/contact" className="hidden sm:block">
            <button className="bg-nhubx-glow-primary text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-glow hover:scale-105 active:scale-95 transition-all">
              Join Now
            </button>
          </Link>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-1 hover:text-nhubx-glow-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="lg:hidden mt-2 glass rounded-2xl overflow-hidden border border-white/10"
          >
            <div className="flex flex-col p-4 gap-4">
              {links.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-nhubx-glow-primary ${
                    location.pathname === link.path ? 'text-nhubx-glow-primary' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setIsOpen(false)} className="sm:hidden">
                <button className="w-full bg-nhubx-glow-primary text-white py-2 rounded-full text-sm font-bold shadow-glow">
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
