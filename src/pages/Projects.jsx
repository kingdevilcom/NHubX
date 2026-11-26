import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import ProjectDetailModal from '../components/ProjectDetailModal';
import ProjectCaseStudies from '../components/ProjectCaseStudies';
import ProjectReviewList from '../components/ProjectReviewList';
import { caseStudies } from '../projectCaseStudies';
import { useProject } from '../context/ProjectContext';
import { Shield, Lock, Wifi, Book, Clock, Cpu } from 'lucide-react';
import { fetchProjects, initializeDefaultProjects } from '../firebase';

export const getProjectIcon = (name, iconName) => {
  const cn = "w-8 h-8 text-nhubx-glow-primary";
  const cnSecondary = "w-8 h-8 text-nhubx-glow-secondary";

  const iconMap = {
    shield: <Shield className={cn} />,
    lock: <Lock className={cnSecondary} />,
    wifi: <Wifi className={cn} />,
    book: <Book className={cn} />,
    clock: <Clock className={cn} />,
    cpu: <Cpu className={cn} />
  };

  const key = iconName ? iconName.toLowerCase() : '';

  if (key && iconMap[key]) {
    return iconMap[key];
  }

  const lowerName = name.toLowerCase();

  if (
    lowerName.includes('helper') ||
    lowerName.includes('prof') ||
    lowerName.includes('book')
  ) return iconMap.book;

  if (
    lowerName.includes('clock') ||
    lowerName.includes('time')
  ) return iconMap.clock;

  if (
    lowerName.includes('auth') ||
    lowerName.includes('shield') ||
    lowerName.includes('secure')
  ) return iconMap.shield;

  if (
    lowerName.includes('pass') ||
    lowerName.includes('lock') ||
    lowerName.includes('key')
  ) return iconMap.lock;

  if (
    lowerName.includes('net') ||
    lowerName.includes('vpn') ||
    lowerName.includes('wifi')
  ) return iconMap.wifi;

  return iconMap.cpu;
};

const defaultProjects = [
  {
    id: 'profhelper',
    name: 'Prof Helper',
    description: 'A comprehensive educational platform developed for students and educators.',
    fullDescription:
      'Prof Helper is a powerful educational platform that bridges the gap between students and teachers. It provides interactive learning modules, assignment tracking, and real-time collaboration tools.',
    iconName: 'Book',
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
    technologies: [
      'React',
      'Node.js',
      'MongoDB',
      'Socket.io',
      'Tailwind CSS'
    ]
  },
  {
    id: 'nclockx',
    name: 'NClockX',
    description: 'A modern clock application with cool theme customization options.',
    fullDescription:
      'NClockX is a beautifully designed clock application that offers multiple themes, timezone support, and stunning visual effects.',
    iconName: 'Clock',
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
    technologies: [
      'React',
      'Framer Motion',
      'Tailwind CSS',
      'JavaScript'
    ]
  },
  {
    id: 'nauthx',
    name: 'NAuthX',
    description: 'Next-generation 2FA and identity verification with biometric support.',
    fullDescription:
      'NAuthX is a cutting-edge authentication platform that provides multi-factor authentication and biometric verification.',
    iconName: 'Shield',
    status: 'DEV',
    type: 'personal',
    link: "https://nauthx.com",
    features: [
      'Two-Factor Authentication',
      'Biometric Verification',
      'Advanced Security Protocols',
      'Session Management',
      'Real-time Threat Detection'
    ],
    technologies: [
      'Node.js',
      'Express',
      'PostgreSQL',
      'JWT'
    ]
  }
];

const Projects = () => {

  const {
    openModal,
    selectedProject,
    isModalOpen,
    closeModal
  } = useProject();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsByProject, setReviewsByProject] = useState({});
  const projectReviewKeys = [
    ...caseStudies.map(({ id }) => 'case-' + id),
    ...projects.filter(({ id }) => /^[\w-]{1,100}$/.test(id)).map(({ id }) => 'catalog-' + id),
  ].join(',');

  useEffect(() => {
    const controller = new AbortController();
    const keys = projectReviewKeys.split(',');
    for (let index = 0; index < keys.length; index += 30) {
      const group = keys.slice(index, index + 30).join(',');
      fetch('/api/reviews?projects=' + encodeURIComponent(group), { signal: controller.signal })
        .then((response) => response.ok ? response.json() : null)
        .then((result) => { if (result && !controller.signal.aborted) setReviewsByProject((current) => ({ ...current, ...result.projects })); })
        .catch(() => {});
    }
    return () => controller.abort();
  }, [projectReviewKeys]);

  useEffect(() => {
    document.title = "Projects | NHubX";
  }, []);

  useEffect(() => {

    const loadProjects = async () => {

      try {

        let data = await fetchProjects();

        if (data.length === 0) {
          data = await initializeDefaultProjects(defaultProjects);
        }

        const mapped = data.map((proj) => ({
          ...proj,
          icon: getProjectIcon(proj.name, proj.iconName)
        }));

        setProjects(mapped);

      } catch (error) {

        console.error(
          "Failed to load projects:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    loadProjects();

  }, []);

  return (
    <>
      <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 overflow-hidden">

        {/* background glow */}
        <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-nhubx-glow-primary/[0.02] blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-500/[0.01] blur-[120px] rounded-full -z-10" />

        <div className="max-w-5xl mx-auto">

          {/* header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >

            <h1 className="site-title mb-5">Projects</h1>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-gray-300">
              Explore websites and apps we’ve built, with case studies and live demos.
            </p>

          </motion.div>

          <ProjectCaseStudies reviewsByProject={reviewsByProject} />
          {loading && <p role="status" className="text-center text-gray-400 py-6">Loading the project catalogue…</p>}

          {/* cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {projects.map((project, i) => (

              <Card
                key={project.name}
                delay={i * 0.05}
                className="flex flex-col justify-between h-full bg-white/[0.01] border-white/[0.04] p-6 rounded-xl"
              >

                <div>

                  <div className="mb-5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] w-fit">
                    {project.icon}
                  </div>

                  <div className="flex justify-between items-start gap-2 mb-3">

                    <h3 className="text-base font-bold tracking-wider uppercase text-white leading-tight">
                      {project.name}
                    </h3>

                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-lg border border-white/10 text-gray-400 tracking-wider uppercase">
                      {project.type}
                    </span>

                  </div>

                  <p className="text-gray-500 text-xs leading-relaxed mb-6">
                    {project.description}
                  </p>
                  <ProjectReviewList reviews={reviewsByProject['catalog-' + project.id]} />

                </div>

                <button
                  onClick={() => openModal(project)}
                  className="site-action mt-3 w-full bg-nhubx-glow-primary hover:bg-nhubx-glow-hover"
                >
                  View project details
                </button>

              </Card>

            ))}

          </div>
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
