import { motion } from 'framer-motion';

const Card = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`glass p-6 hover:glow-border transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
