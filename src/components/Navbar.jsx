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
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 text-gray-300 hover:text-nhubx-glow-primary p-2 hover:bg-white/5 rounded-lg transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <motion.nav 
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen w-64 z-40 lg:z-50 lg:static lg:h-auto lg:w-auto lg:translate-x-0"
      >
        <div className="glass-navbar h-full lg:h-auto flex flex-col lg:flex-row lg:items-center lg:justify-between lg:rounded-none gap-0 p-0 border-r border-white/20 lg:border-r-0 lg:border-b shadow-lg lg:shadow-none">
          
          {/* Logo Section */}
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group shrink-0 min-w-fit hover:opacity-90 transition-opacity p-6 lg:p-0 lg:ml-0 border-b border-white/10 lg:border-b-0">
            <div className="relative">
              <img src="/NHubX2.0.png" alt="NHubX Logo" className="w-12 h-12 lg:w-10 lg:h-10 shadow-lg group-hover:shadow-glow flex-shrink-0 rounded-lg transition-all duration-300" />
              <div className="absolute inset-0 bg-nhubx-glow-primary/0 group-hover:bg-nhubx-glow-primary/10 rounded-lg transition-all duration-300"></div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-lg lg:text-base glow-text-primary leading-tight">NHubX</span>
              <div className="hidden lg:block -mt-1">
                <DigitalClock />
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-2 p-4 lg:p-0 flex-1 lg:flex-initial">
            {links.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-6 lg:px-4 py-3 lg:py-2 rounded-lg text-base lg:text-sm font-medium transition-all duration-200 hover:text-nhubx-glow-primary whitespace-nowrap ${
                  location.pathname === link.path 
                    ? 'text-nhubx-glow-primary bg-nhubx-glow-primary/10 border-l-2 lg:border-l-0 border-nhubx-glow-primary' 
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link to="/contact" onClick={() => setIsOpen(false)} className="p-4 lg:p-0 border-t border-white/10 lg:border-t-0">
            <button className="w-full lg:w-auto bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/90 text-white px-6 py-3 lg:px-5 lg:py-2 rounded-lg text-base lg:text-sm font-bold shadow-lg shadow-nhubx-glow-primary/50 hover:shadow-nhubx-glow-primary/80 active:scale-95 transition-all whitespace-nowrap">
              Join Now
            </button>
          </Link>
        </div>
      </motion.nav>

      {/* Main Content Padding (Desktop) */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 pointer-events-none" />
    </>
  );
};

export default Navbar;
