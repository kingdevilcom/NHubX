import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-[95%] sm:w-[92%] md:w-[90%] max-w-6xl mx-auto py-8 px-6 sm:px-8 mb-8 mt-24 glass-panel border border-white/[0.06] shadow-2xl relative z-10 overflow-hidden">
      
      {/* glow */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-nhubx-glow-primary/[0.03] blur-[80px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10">

        {/* top */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/NHubX2.0.png"
              alt="NHubX Logo"
              className="w-6 h-6 rounded grayscale opacity-50 border border-white/10 group-hover:opacity-100 transition"
            />

            <span className="text-gray-500 font-bold tracking-tight group-hover:text-white transition">
              NHubX
            </span>
          </Link>

          {/* copyright */}
          <p className="text-gray-600 text-sm text-center">
            © 2026{' '}
            <span className="text-nhubx-glow-primary/70">
              NanoKillX
            </span>{' '}
            | NHubX Infrastructure
          </p>

          {/* socials */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <a
              href="https://www.facebook.com/profile.php?id=61558472124147"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-nhubx-glow-primary transition-colors text-sm"
            >
              Facebook
            </a>

            <a
              href="https://github.com/NanoKillX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-nhubx-glow-primary transition-colors text-sm"
            >
              Github
            </a>

            <a
              href="https://www.instagram.com/nanokillx/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-nhubx-glow-primary transition-colors text-sm"
            >
              Instagram
            </a>

            <a
              href="https://api.whatsapp.com/send/?phone=94707418010&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-nhubx-glow-primary transition-colors text-sm"
            >
              Whatsapp
            </a>
          </div>
        </div>

        {/* internal seo links */}
        <div className="flex flex-wrap items-center justify-center gap-5 border-t border-white/5 pt-5">

          <Link
            to="/"
            className="text-gray-500 hover:text-white transition text-sm"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="text-gray-500 hover:text-white transition text-sm"
          >
            About
          </Link>

          <Link
            to="/projects"
            className="text-gray-500 hover:text-white transition text-sm"
          >
            Projects
          </Link>

          <Link
            to="/developer"
            className="text-gray-500 hover:text-white transition text-sm"
          >
            Developer
          </Link>

          <Link
            to="/contact"
            className="text-gray-500 hover:text-white transition text-sm"
          >
            Contact
          </Link>

          <Link
            to="/privacy-policy"
            className="text-gray-500 hover:text-white transition text-sm"
          >
            Privacy Policy
          </Link>
        </div>

        {/* seo text */}
        <div className="text-center text-xs text-gray-700 tracking-wide">
          Web Development • Cybersecurity • AI Systems • Automation
        </div>

      </div>
    </footer>
  );
};

export default Footer;
