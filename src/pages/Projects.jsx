import { motion } from 'framer-motion';
import Card from '../components/Card';
import ProjectDetailModal from '../components/ProjectDetailModal';
import { useProject } from '../context/ProjectContext';
import { Shield, Lock, Wifi, Book, Clock } from 'lucide-react';

const projects = [
  {
    name: 'Prof Helper',
    description: 'A comprehensive educational platform developed for students and educators.',
    fullDescription: 'Prof Helper is a powerful educational platform that bridges the gap between students and teachers. It provides interactive learning modules, assignment tracking, and real-time collaboration tools.',
    icon: <Book className="w-10 h-10 text-nhubx-glow-primary" />,
    status: 'LIVE',
    type: 'personal',
    link: "https://profhelper.com",
    features: [
      'Interactive Learning Modules',
      'Assignment Management System',
      'Real-time Collaboration Tools',
      'Progress Tracking Dashboard',
      'Multi-platform Support'
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Tailwind CSS']
  },
  {
    name: 'NClockX',
    description: 'A modern clock application with cool theme customization options.',
    fullDescription: 'NClockX is a beautifully designed clock application that offers multiple themes, timezone support, and stunning visual effects. Perfect for developers who want a stylish time display.',
    icon: <Clock className="w-10 h-10 text-nhubx-glow-primary" />,
    status: 'LIVE',
    type: 'personal',
    link: "https://clock.nhubx.com/",
    features: [
      'Multiple Theme Variants',
      'Timezone Support',
      'Alarm & Timer Functions',
      'Glassmorphism Design',
      'Responsive Interface'
    ],
    technologies: ['React', 'Framer Motion', 'Tailwind CSS', 'JavaScript']
  },
  {
    name: 'NAuthX',
    description: 'Next-generation 2FA and identity verification with biometric support.',
    fullDescription: 'NAuthX is a cutting-edge authentication platform that provides multi-factor authentication, biometric verification, and advanced security protocols for modern applications.',
    icon: <Shield className="w-10 h-10 text-nhubx-glow-primary" />,
    status: 'DEV',
    type: 'personal',
    link: "https://NAuthX.com",
    features: [
      'Two-Factor Authentication',
      'Biometric Verification',
      'Advanced Security Protocols',
      'Session Management',
      'Real-time Threat Detection'
    ],
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'Biometric APIs', 'JWT']
  },
  {
    name: 'NPassX',
    description: 'Zero-knowledge password management for elite security teams.',
    fullDescription: 'NPassX is an enterprise-grade password management solution that uses zero-knowledge encryption, ensuring that even NPassX cannot access your passwords.',
    icon: <Lock className="w-10 h-10 text-nhubx-glow-secondary" />,
    status: 'DEV',
    type: 'personal',
    link: "https://NPassX.com",
    features: [
      'Zero-Knowledge Encryption',
      'Password Strength Analysis',
      'Breach Detection',
      'Team Collaboration',
      'Secure Sharing'
    ],
    technologies: ['End-to-End Encryption', 'React', 'Node.js', 'PostgreSQL', 'TweetNaCl.js']
  },
  {
    name: 'NNetX',
    description: 'Decentralized VPN infrastructure with wireguard integration.',
    fullDescription: 'NNetX provides a decentralized VPN solution built on modern wireguard technology, offering unmatched privacy and speed for users worldwide.',
    icon: <Wifi className="w-10 h-10 text-nhubx-glow-primary" />,
    status: 'DEV',
    type: 'personal',
    link: "https://NNetX.com",
    features: [
      'Wireguard Protocol',
      'Decentralized Infrastructure',
      'Global Server Network',
      'DNS Privacy',
      'Kill Switch Protection'
    ],
    technologies: ['Wireguard', 'Go', 'Docker', 'Linux', 'React']
  }
];

const Projects = () => {
  const { openModal, selectedProject, isModalOpen, closeModal } = useProject();

  return (
    <>
      <div className="pt-32 px-4 sm:px-6 max-w-6xl mx-auto min-h-screen pb-12 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">Our <span className="glow-text-primary">Projects</span></h2>
          <p className="text-gray-400 mx-auto max-w-2xl text-sm md:text-base px-2">
            A suite of high-performance tools designed for the modern digital era. Each project is engineered for maximum security and scale.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {projects.map((project, i) => (
            <Card key={project.name} delay={i * 0.1}>
              <div className="mb-6">{project.icon}</div>
              <div className="flex justify-between items-start gap-3 mb-4">
                <h3 className="text-xl sm:text-2xl font-bold flex-1">{project.name}</h3>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full whitespace-nowrap border flex-shrink-0 ${
                  project.type === 'personal'
                    ? 'border-blue-500/30 text-blue-300 bg-blue-500/10'
                    : 'border-purple-500/30 text-purple-300 bg-purple-500/10'
                }`}>
                  {project.type === 'personal' ? 'PERSONAL' : 'CLIENT'}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black px-2 py-0.5 rounded border border-nhubx-glow-secondary/30 text-nhubx-glow-secondary bg-nhubx-glow-secondary/10">
                  {project.status}
                </span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-2">
                {project.description}
              </p>
              <button 
                onClick={() => openModal(project)}
                className="w-full text-xs sm:text-sm font-bold text-white bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/80 px-4 py-2.5 rounded-lg transition-all shadow-glow hover:scale-105 active:scale-95 mb-3"
              >
                VIEW PROJECT
              </button>
            </Card>
          ))}
        </div>
      </div>

      <ProjectDetailModal 
        isOpen={isModalOpen}
        project={selectedProject}
        onClose={closeModal}
      />
    </>
  );
};

export default Projects;
