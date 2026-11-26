import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaGithub, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const groups = [
  ['Explore', [['/projects', 'Projects'], ['/pricing', 'Pricing'], ['/reviews', 'Reviews'], ['/websites-for-service-businesses', 'Service business websites']]],
  ['NHubX', [['/about', 'About'], ['/developer', 'Developer'], ['/contact', 'Contact'], ['/orders', 'My orders']]],
];

const socialLinks = [
  [FaGithub, 'GitHub', 'https://github.com/NanoKillX'],
  [FaInstagram, 'Instagram', 'https://www.instagram.com/nanokillx/'],
  [FaFacebookF, 'Facebook', 'https://www.facebook.com/profile.php?id=61558472124147'],
  [FaWhatsapp, 'WhatsApp', 'https://api.whatsapp.com/send/?phone=94740356525'],
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-[#101012]">
      <div className="site-container">
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 py-10 sm:grid-cols-[1.4fr_1fr_1fr] sm:py-12">
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 text-xl font-bold">
              <img src="/nhubx-logo.png" alt="" width="42" height="42" className="rounded-xl" />
              NHubX
            </Link>
            <p className="mt-3 text-sm text-gray-300">Custom websites and web applications.</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-400"><MapPin size={15} aria-hidden="true" /> Matara, Sri Lanka</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {socialLinks.map(([Icon, label, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label + ' (opens in a new tab)'} className="grid size-11 place-items-center rounded-xl border border-white/10 text-gray-300 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-white">
                  <Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          {groups.map(([label, links]) => (
            <nav key={label} aria-label={label}>
              <p className="font-semibold text-white">{label}</p>
              <ul className="mt-2 space-y-1">
                {links.map(([path, name]) => <li key={path}><Link to={path} className="inline-block py-1 text-sm text-gray-300 hover:text-white hover:underline">{name}</Link></li>)}
              </ul>
            </nav>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-5 text-sm text-gray-400">
          <p>© 2026 NanoKillX · NHubX</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-white hover:underline">Privacy</Link>
            <Link to="/terms-and-conditions" className="hover:text-white hover:underline">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
