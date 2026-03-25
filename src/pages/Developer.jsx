import { motion } from 'framer-motion';
import Card from '../components/Card';

const Developer = () => {
  const skills = ['React', 'Next.js', 'Node.js', 'Solidity', 'Cybersecurity', 'UI/UX'];

  return (
    <div className="pt-32 px-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:grid md:grid-cols-12 gap-8">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-4">
          <Card className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-nhubx-glow-primary/20 shadow-glow">
              <img src="/logo.jpg" alt="NanoKillX" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold mb-2">NanoKillX</h3>
            <p className="text-nhubx-glow-primary font-medium text-sm mb-6 uppercase tracking-widest">Lead Developer</p>
            
            <div className="flex flex-wrap justify-center gap-2">
              {skills.map(skill => (
                <span key={skill} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400">
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Bio & Terminal */}
        <div className="md:col-span-8 flex flex-col gap-8">
          <Card className="relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl font-black italic">03</span>
             </div>
             <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-nhubx-glow-primary animate-pulse" />
                The Architect
             </h4>
             <p className="text-gray-400 leading-relaxed z-10 relative">
               Building the future of the decentralized web. NanoKillX specializes in high-performance infrastructure and intuitive security interfaces. With a focus on obsidian-like stability and neon-fast performance, NHubX is the culmination of years of R&D in the security space.
             </p>
          </Card>

          {/* Terminal-style Block */}
          <div className="bg-black/80 rounded-2xl border border-white/5 p-6 font-mono text-sm overflow-hidden shadow-2xl relative">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-green-400"><span className="text-white">$</span> whoami</p>
              <p className="text-gray-500">NanoKillX // Senior Dev & Architect</p>
              <p className="text-green-400"><span className="text-white">$</span> fetch --stats</p>
              <p className="text-gray-500">Projects: 12 Active // 98% Uptime // Security Level: OMEGA</p>
              <p className="text-green-400 flex items-center gap-2">
                <span className="text-white">$</span> status --active <span className="w-2 h-4 bg-nhubx-glow-primary animate-pulse" />
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-nhubx-glow-primary/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developer;
