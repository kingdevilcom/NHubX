import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  ['Home', '/'],
  ['Projects', '/projects'],
  ['Pricing', '/pricing'],
  ['About', '/about'],
  ['Developer', '/developer'],
  ['Contact', '/contact'],
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="site-nav site-width" aria-label="Main navigation" onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          setIsOpen(false);
          event.currentTarget.querySelector('button').focus();
        }
      }}>
        <Link to="/" className="site-brand" onClick={() => setIsOpen(false)}>
          <img src="/NHubX2.0.png" alt="" width="32" height="32" />
          NHubX
        </Link>
        <button
          type="button"
          className="site-menu-toggle"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isOpen}
          aria-controls="site-nav-links"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <ul id="site-nav-links" className="site-nav-links" data-open={isOpen}>
          {links.map(([label, path]) => (
            <li key={path}>
              <NavLink end to={path} onClick={() => setIsOpen(false)}>{label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
