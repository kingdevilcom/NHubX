import { motion } from 'framer-motion';
import Card from '../components/Card';
import { Shield, Lock, Wifi, Book } from 'lucide-react';

const projects = [
  {
    name: 'Prof Helper',
    description: 'A Website Develop By NanoKillX.',
    icon: <Book className="w-10 h-10 text-nhubx-glow-primary" />,
    status: 'LIVE',
    link: "https://profhelper.com"
  },
  {
    name: 'NAuthX',
    description: 'Next-gen 2FA and identity verification platform with biometric support.',
    icon: <Shield className="w-10 h-10 text-nhubx-glow-primary" />,
    status: 'DEV',
    link: "https://NAuthX.com"
  },
  {
    name: 'NPassX',
    description: 'Zero-knowledge password management for elite security teams.',
    icon: <Lock className="w-10 h-10 text-nhubx-glow-secondary" />,
    status: 'DEV',
    link: "https://NPassX.com"
  },
  {
    name: 'NNetX',
    description: 'Decentralized VPN infrastructure with wireguard integration.',
    icon: <Wifi className="w-10 h-10 text-nhubx-glow-primary" />,
    status: 'DEV',
    link: "https://NNetX.com"
  }
];

const Projects = () => {
  return (
    <div className="pt-32 px-6 max-w-6xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 md:mb-20"
      >
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">Our <span className="glow-text-primary">Projects</span></h2>
        <p className="text-gray-400 mx-auto max-w-2xl text-sm md:text-base">
          A suite of high-performance tools designed for the modern digital era. Each project is engineered for maximum security and scale.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <Card key={project.name} delay={i * 0.1}>
            <div className="mb-6">{project.icon}</div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">{project.name}</h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded border border-nhubx-glow-secondary/30 text-nhubx-glow-secondary bg-nhubx-glow-secondary/10">
                {project.status}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {project.description}
            </p>
            <a href={project.link}><button className="text-xs font-bold text-nhubx-glow-primary hover:underline underline-offset-4">
              VIEW DETAILS →
            </button></a>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Projects;
