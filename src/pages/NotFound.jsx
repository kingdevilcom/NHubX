import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden bg-nhubx-bg-primary">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10"
      >
        <h1 className="text-[150px] md:text-[250px] font-black tracking-tighter leading-none animate-glitch opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
          404
        </h1>
        
        <div className="relative">
          <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
            System <span className="text-nhubx-glow-primary">Error</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-mono mb-8 tracking-widest uppercase">
            [ Node_Not_Found ] // access_denied.sh
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <p className="text-gray-500 max-w-md text-sm leading-relaxed">
              The requested node does not exist in the NHubX infrastructure. Please re-authenticate or return to the central control hub.
            </p>
            <Link to="/">
              <Button variant="primary" className="px-10 py-4 text-base">
                Return to Hub
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Decorative Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,60,0,0.05)_0%,transparent_70%)]" />
    </div>
  );
};

export default NotFound;
