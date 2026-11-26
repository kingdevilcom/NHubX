import { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Package, X } from 'lucide-react';

const links = [
  ['/', 'Home'],
  ['/projects', 'Projects'],
  ['/pricing', 'Pricing'],
  ['/reviews', 'Reviews'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useRef(null);

  return (
    <nav aria-label="Main navigation" className="public-nav" onKeyDown={(event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        toggle.current?.focus();
      }
    }}>
      <div className="public-nav-inner">
        <Link to="/" aria-label="NHubX home" className="flex min-h-11 items-center gap-2.5" onClick={() => setIsOpen(false)}>
          <img src="/nhubx-logo.png" alt="" width="34" height="34" className="rounded-lg" />
          <span className="text-lg font-bold tracking-tight">NHub<span className="text-nhubx-glow-primary">X</span></span>
        </Link>
        <div className="hidden items-center gap-0.5 md:flex">
          {links.map(([path, label]) => <NavLink key={path} to={path} end className="public-nav-link">{label}</NavLink>)}
        </div>
        <div className="flex items-center gap-2">
          <NavLink to="/orders" className="public-nav-link inline-flex items-center gap-2"><Package size={16} aria-hidden="true" /> My orders</NavLink>
          <button ref={toggle} type="button" aria-label={isOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={isOpen} aria-controls="mobile-navigation" className="grid size-11 place-items-center rounded-xl border border-white/15 md:hidden" onClick={() => setIsOpen((open) => !open)}>
            {isOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div id="mobile-navigation" hidden={!isOpen} className="public-mobile-nav md:!hidden">
        {links.map(([path, label]) => <NavLink key={path} to={path} end className="public-nav-link block" onClick={() => setIsOpen(false)}>{label}</NavLink>)}
      </div>
    </nav>
  );
}
