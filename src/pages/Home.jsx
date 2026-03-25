import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Rocket, Shield, Globe } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-nhubx-glow-primary to-nhubx-glow-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-4 animate-glitch">
            NHUB<span className="text-nhubx-glow-primary">X</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 font-medium tracking-wide mb-8 px-4">
            One Hub. <span className="text-white">Infinite Power.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-6">
            <Button variant="primary" className="w-full sm:w-auto">Explore Projects</Button>
            <Button variant="secondary" className="w-full sm:w-auto">View Docs</Button>
          </div>
        </motion.div>

        {/* Floating Background Element */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-20 top-1/4 w-64 h-64 glass opacity-20 -z-10 rounded-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-10 bottom-20 w-48 h-48 glass opacity-10 -z-10 rounded-full"
        />
      </section>
    </div>
  );
};

export default Home;
