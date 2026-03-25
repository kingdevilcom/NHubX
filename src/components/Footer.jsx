import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 border-t border-white/5 bg-nhubx-bg-primary mt-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-full grayscale opacity-50" />
          <span className="text-gray-500 font-bold tracking-tight">NHubX</span>
        </div>
        
        <p className="text-gray-600 text-sm">
          © 2026 <span className="text-nhubx-glow-primary/70">NanoKillX</span> | NHubX Infrastructure
        </p>

        <div className="flex items-center gap-6">
          <a href="#" className="text-gray-500 hover:text-nhubx-glow-primary transition-colors text-sm">Twitter</a>
          <a href="#" className="text-gray-500 hover:text-nhubx-glow-primary transition-colors text-sm">Github</a>
          <a href="#" className="text-gray-500 hover:text-nhubx-glow-primary transition-colors text-sm">Discord</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
