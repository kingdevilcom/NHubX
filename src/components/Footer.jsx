import { Link } from 'react-router-dom';

import {
  FaGithub,
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-[95%] sm:w-[92%] md:w-[90%] max-w-7xl mx-auto mt-20 mb-8 px-6 md:px-10 py-8 rounded-[28px] border border-white/[0.06] bg-black/50 backdrop-blur-2xl relative overflow-hidden">

      {/* glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[180px] bg-nhubx-glow-primary/[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-8">

        {/* top */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* logo */}
          <Link
            to="/"
            className="flex items-center gap-4"
          >
            <img
              src="/NHubX2.0.png"
              alt="NHubX Logo"
              className="w-12 h-12 rounded-2xl border border-white/10"
            />

            <div>
              <h2 className="text-xl font-bold text-white">
                NHubX
              </h2>

              <p className="text-sm text-gray-500">
                Modern Digital Infrastructure
              </p>
            </div>
          </Link>

          {/* nav */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">

            <Link
              to="/"
              className="text-gray-500 hover:text-white transition"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="text-gray-500 hover:text-white transition"
            >
              About
            </Link>

            <Link
              to="/projects"
              className="text-gray-500 hover:text-white transition"
            >
              Projects
            </Link>

            <Link
              to="/developer"
              className="text-gray-500 hover:text-white transition"
            >
              Developer
            </Link>

            <Link
              to="/contact"
              className="text-gray-500 hover:text-white transition"
            >
              Contact
            </Link>
          </div>

          {/* socials */}
          <div className="flex items-center gap-3">

            <a
              href="https://github.com/NanoKillX"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition"
            >
              <FaGithub size={16} />
            </a>

            <a
              href="https://www.instagram.com/nanokillx/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-pink-400 hover:border-pink-400/20 transition"
            >
              <FaInstagram size={16} />
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61558472124147"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-blue-400 hover:border-blue-400/20 transition"
            >
              <FaFacebookF size={16} />
            </a>

            <a
              href="https://api.whatsapp.com/send/?phone=94740356525"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-green-400 hover:border-green-400/20 transition"
            >
              <FaWhatsapp size={16} />
            </a>

          </div>
        </div>

        {/* divider */}
        <div className="w-full h-px bg-white/5" />

        {/* bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">

          <p className="text-gray-600 text-center">
            © 2026{' '}
            <span className="text-nhubx-glow-primary">
              NanoKillX
            </span>{' '}
            • NHubX
          </p>

          <div className="flex items-center gap-5">

            <Link
              to="/privacy-policy"
              className="text-gray-600 hover:text-white transition"
            >
              Privacy
            </Link>

            <Link
              to="/terms-and-conditions"
              className="text-gray-600 hover:text-white transition"
            >
              Terms
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
