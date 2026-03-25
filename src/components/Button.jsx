import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = "", variant = "primary" }) => {
  const baseStyles = "px-6 py-2 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-nhubx-glow-primary text-white shadow-glow hover:shadow-glow-lg hover:scale-105 active:scale-95",
    secondary: "bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-nhubx-glow-primary/50",
    outline: "border-2 border-nhubx-glow-primary text-nhubx-glow-primary hover:bg-nhubx-glow-primary hover:text-white"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
