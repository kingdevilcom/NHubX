import { Link } from 'react-router-dom';

import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaWhatsapp,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-[95%] sm:w-[92%] md:w-[90%] max-w-7xl mx-auto mt-24 mb-8 px-6 md:px-10 py-12 rounded-[32px] border border-white/[0.06] bg-black/50 backdrop-blur-2xl relative overflow-hidden">

      {/* glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-nhubx-glow-primary/[0.05] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-12">

        {/* top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* brand */}
          <div className="flex flex-col gap-6">

            <Link
              to="/"
              className="flex items-center gap-4 w-fit"
            >
              <img
                src="/NHubX2.0.png"
                alt="NHubX Logo"
                className="w-16 h-16 rounded-2xl border border-white/10"
              />

              <div>
                <h2 className="text-2xl font-bold text-white">
                  NHubX
                </h2>

                <p className="text-sm text-gray-500">
                  Modern Digital Infrastructure
                </p>
              </div>
            </Link>

            <p className="text-gray-500 leading-8 text-[15px]">
              Web development, cybersecurity, AI systems,
              automation, and futuristic digital experiences.
            </p>

            {/* socials */}
            <div className="flex items-center gap-4">

              <a
                href="https://www.facebook.com/profile.php?id=61558472124147"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-blue-400 hover:border-blue-400/30 transition"
              >
                <FaFacebookF size={16} />
              </a>

              <a
                href="https://github.com/NanoKillX"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition"
              >
                <FaGithub size={16} />
              </a>

              <a
                href="https://www.instagram.com/nanokillx/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-pink-400 hover:border-pink-400/30 transition"
              >
                <FaInstagram size={16} />
              </a>

              <a
                href="https://api.whatsapp.com/send/?phone=94707418010&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-green-400 hover:border-green-400/30 transition"
              >
                <FaWhatsapp size={16} />
              </a>

            </div>
          </div>

          {/* links */}
          <div className="flex flex-col gap-6">

            <h3 className="text-white font-semibold uppercase tracking-wide">
              Quick Links
            </h3>

            <div className="flex flex-col gap-4">

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

              <Link
                to="/privacy-policy"
                className="text-gray-500 hover:text-white transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms-and-conditions"
                className="text-gray-500 hover:text-white transition"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* contact */}
          <div className="flex flex-col gap-6">

            <h3 className="text-white font-semibold uppercase tracking-wide">
              Contact
            </h3>

            <div className="flex flex-col gap-5 text-gray-500">

              <a
                href="mailto:contact@nhubx.com"
                className="hover:text-white transition"
              >
                contact@nhubx.com
              </a>

              <a
                href="https://api.whatsapp.com/send/?phone=94707418010"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                +94 74 035 6525
              </a>

              <p>Sri Lanka</p>

              <p className="text-sm leading-7">
                Available for freelance projects,
                cybersecurity solutions, and modern
                digital infrastructure development.
              </p>
            </div>
          </div>

          {/* info */}
          <div className="flex flex-col gap-6">

            <h3 className="text-white font-semibold uppercase tracking-wide">
              Services
            </h3>

            <div className="flex flex-col gap-4 text-gray-500">

              <p>Web Development</p>
              <p>Cybersecurity</p>
              <p>AI Systems</p>
              <p>Automation</p>
              <p>UI/UX Design</p>
              <p>Cloud Infrastructure</p>

            </div>
          </div>
        </div>

        {/* divider */}
        <div className="w-full h-px bg-white/5" />

        {/* bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">

          <p className="text-gray-600 text-sm">
            © 2026{' '}
            <span className="text-nhubx-glow-primary">
              NanoKillX
            </span>{' '}
            • NHubX Infrastructure
          </p>

          <p className="text-gray-700 text-sm text-center">
            Web Development • Cybersecurity • AI Systems • Automation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
