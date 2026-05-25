import { motion } from 'framer-motion';
import Card from '../components/Card';
import { Terminal, Cpu, CheckCircle } from 'lucide-react';

const Developer = () => {
  const skills = ['React', 'Next.js', 'Node.js', 'Solidity', 'Cybersecurity', 'UI/UX', 'WireGuard', 'Docker', 'Linux'];

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
      
      {/* Soft background glow */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-nhubx-glow-primary/[0.02] blur-[120px] rounded-full -z-10 animate-glow-pulse" />
      <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] bg-purple-500/[0.01] blur-[120px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* Title Block */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.02] border border-white/[0.06] text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 font-mono">
            Security Status: Clearance Omega
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight leading-none text-white">
            The <span className="glow-text-primary">Developer</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl">
            Operational details and core diagnostic telemetry profile of NanoKillX.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Profile Card (4 Cols) */}
          <div className="lg:col-span-4">
            <Card className="flex flex-col items-center text-center bg-white/[0.01] border-white/[0.04] p-6 rounded-xl">
              
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-lg overflow-hidden border border-white/10 shadow-md relative z-10 bg-white/[0.02] backdrop-blur-md flex items-center justify-center">
                  <img 
                    src="/logo.jpg" 
                    alt="NanoKillX" 
                    className="w-full h-full object-cover grayscale"
                    onError={(e) => {
                      e.target.src = '/NHubX2.0.png';
                    }}
                  />
                </div>
                <div className="absolute inset-0 w-28 h-28 rounded-lg bg-nhubx-glow-primary/5 blur-md translate-y-1 scale-95" />
              </div>

              <h3 className="text-xl font-bold tracking-wider uppercase text-white mb-0.5">NanoKillX</h3>
              <p className="text-nhubx-glow-primary font-bold text-[10px] uppercase tracking-widest mb-6 font-mono">Core Architect</p>

              <div className="w-full border-t border-white/[0.03] pt-6 mb-6">
                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3 font-mono">Skillset</div>
                <div className="flex flex-wrap justify-center gap-1">
                  {skills.map(skill => (
                    <span 
                      key={skill} 
                      className="px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05] text-[9px] font-bold text-gray-500 uppercase tracking-wider hover:border-nhubx-glow-primary/20 transition-all duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="w-full bg-white/[0.01] border border-white/[0.03] p-3 rounded-lg text-left flex items-center justify-between text-[9px] text-gray-500 font-mono uppercase tracking-widest">
                <span>Network state</span>
                <span className="flex items-center gap-1.5 text-green-400 font-bold">
                  <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                  ONLINE
                </span>
              </div>

            </Card>
          </div>

          {/* Right Column: Bio & Terminal (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Biography */}
            <Card className="relative overflow-hidden group bg-white/[0.01] border-white/[0.04] p-6 rounded-xl">
              <h4 className="text-sm font-bold uppercase mb-3 tracking-wider flex items-center gap-1.5 text-white">
                <span className="w-1 h-1 rounded-full bg-nhubx-glow-primary animate-pulse" />
                The Core Architect
              </h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Pioneering high-integrity, zero-trust structures on the decentralized web. NanoKillX specializes in writing bulletproof network tunnels, robust biometric key verifiers, and highly optimized UI engines. With a dedication to obsidian-grade reliability and neon-fast deployment velocities, NHubX is the product of continuous systems analysis and cryptographic design research.
              </p>
            </Card>

            {/* Faint elegant console block */}
            <div className="glass border border-white/[0.06] rounded-xl shadow-md overflow-hidden relative">
              
              {/* Header */}
              <div className="bg-white/[0.01] px-5 py-2.5 flex items-center justify-between border-b border-white/[0.03]">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/40" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                  <div className="w-2 h-2 rounded-full bg-green-500/40" />
                </div>
                <div className="text-[9px] font-mono text-gray-500 tracking-wider flex items-center gap-1">
                  <Terminal size={8} className="text-nhubx-glow-primary" />
                  nanokillx@nhubx-dossier: ~
                </div>
                <div className="w-8" />
              </div>

              {/* Logs */}
              <div className="p-5 font-mono text-[11px] text-gray-500 flex flex-col gap-3 min-h-[220px]">
                <div>
                  <p className="text-gray-400"><span className="text-nhubx-glow-primary font-bold">$</span> whoami</p>
                  <p className="text-gray-600 mt-0.5 pl-3">NanoKillX // Core Architect & System Lead</p>
                  <p className="text-gray-600 pl-3">Signature: E1A5-FF3C-00FF-8B1A (SSH)</p>
                </div>
                
                <div>
                  <p className="text-gray-400"><span className="text-nhubx-glow-primary font-bold">$</span> sys --check</p>
                  <p className="text-green-500/60 mt-0.5 pl-3 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-green-500/50" />
                    [OK] Tunnels verified (WireGuard peer)
                  </p>
                  <p className="text-green-500/60 pl-3 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-green-500/50" />
                    [OK] Uptime holds steady at 99.98%
                  </p>
                </div>

                <div>
                  <p className="text-gray-400"><span className="text-nhubx-glow-primary font-bold">$</span> telemetry --active</p>
                  <p className="text-nhubx-glow-secondary/70 font-bold pl-3 uppercase tracking-wider mt-0.5">
                    Connection handshakes ready.
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 flex items-center gap-1">
                    <span className="text-nhubx-glow-primary font-bold">$</span> dossier --active
                    <span className="w-1.5 h-3.5 bg-nhubx-glow-primary/65 animate-pulse inline-block" />
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Developer;
