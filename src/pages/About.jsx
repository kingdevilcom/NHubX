import { motion } from 'framer-motion';
import Card from '../components/Card';

const About = () => {
  return (
    <div className="pt-32 px-6 max-w-6xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-12 md:mb-20"
      >
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6">About <span className="text-nhubx-glow-primary">NHubX</span></h2>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl">
          Innovating at the edge of security and decentralization. NHubX is more than a platform; it's an ecosystem built for those who demand ultimate control and performance.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card delay={0.1}>
          <h3 className="text-2xl font-bold mb-4 text-nhubx-glow-primary">What is NHubX?</h3>
          <p className="text-gray-400 leading-relaxed">
            NHubX is a centralized control hub for cutting-edge security tools and decentralized systems. From sophisticated 2FA solutions to high-performance VPNs, we provide the infrastructure for the next generation of the web.
          </p>
        </Card>

        <Card delay={0.2}>
          <h3 className="text-2xl font-bold mb-4 text-nhubx-glow-primary">Our Purpose</h3>
          <p className="text-gray-400 leading-relaxed">
            Our mission is to simplify complexity. By integrating essential security tools into a single, high-performance interface, we empower developers and security professionals to work faster and more securely than ever before.
          </p>
        </Card>
      </div>

      {/* Decorative Blur */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-nhubx-glow-primary/10 blur-3xl rounded-full -z-10" />
    </div>
  );
};

export default About;
