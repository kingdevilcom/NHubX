import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-[95%] sm:w-[92%] md:w-[90%] max-w-6xl mx-auto mt-24 mb-8 px-6 sm:px-10 py-10 rounded-[28px] border border-white/[0.06] bg-black/40 backdrop-blur-xl overflow-hidden relative">

      {/* glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-nhubx-glow-primary/[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-10">

        {/* top */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* brand */}
          <div className="flex flex-col items-center lg:items-start gap-3">

            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/NHubX2.0.png"
                alt="NHubX Logo"
                className="w-10 h-10 rounded-xl border border-white/10 opacity-80 group-hover:opacity-100 transition"
              />

              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  NHubX
                </h2>

                <p className="text-xs text-gray-500">
                  Modern Digital Infrastructure
                </p>
              </div>
            </Link>

            <p className="text-sm text-gray-600 max-w-xs text-center lg:text-left leading-relaxed">
              Web development, cybersecurity, AI systems, automation,
              and futuristic digital experiences.
            </p>
          </div>

          {/* center links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm">

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
          </div>

          {/* socials */}
          <div className="flex items-center gap-5 flex-wrap justify-center">

            <a
              href="https://www.facebook.com/profile.php?id=61558472124147"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-nhubx-glow-primary transition"
            >
              Facebook
            </a>

            <a
              href="https://github.com/NanoKillX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-nhubx-glow-primary transition"
            >
              Github
            </a>

            <a
              href="https://www.instagram.com/nanokillx/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-nhubx-glow-primary transition"
            >
              Instagram
            </a>

            <a
              href="https://api.whatsapp.com/send/?phone=94740356525&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-nhubx-glow-primary transition"
            >
              Whatsapp
            </a>
          </div>
        </div>

        {/* divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">

          <p className="text-gray-600 text-center md:text-left">
            © 2026{' '}
            <span className="text-nhubx-glow-primary/80">
              NanoKillX
            </span>{' '}
            • NHubX Infrastructure
          </p>

          <p className="text-gray-700 text-center">
            Web Development • Cybersecurity • AI Systems • Automation
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
