import { Link } from 'react-router-dom';
import { FaFacebookF, FaGithub, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const socials = [
  ['GitHub', 'https://github.com/NanoKillX', FaGithub],
  ['Instagram', 'https://www.instagram.com/nanokillx/', FaInstagram],
  ['Facebook', 'https://www.facebook.com/profile.php?id=61558472124147', FaFacebookF],
  ['WhatsApp', 'https://api.whatsapp.com/send/?phone=94740356525', FaWhatsapp],
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-row site-width">
        <p>© {new Date().getFullYear()} NanoKillX · NHubX</p>
        <nav className="site-footer-links" aria-label="Legal">
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms-and-conditions">Terms</Link>
        </nav>
        <div className="site-socials">
          {socials.map(([label, url, Icon]) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Icon size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
