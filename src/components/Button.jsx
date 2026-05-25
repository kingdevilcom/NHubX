import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = "", variant = "primary", type = "button" }) => {
  const baseStyles = "px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 select-none whitespace-nowrap";
  const variants = {
    primary: "bg-nhubx-glow-primary text-white shadow-glow hover:shadow-glow-lg hover:bg-nhubx-glow-primary/95 border border-nhubx-glow-primary/10 active:scale-98",
    secondary: "bg-white/[0.02] border border-white/[0.08] text-white hover:bg-white/[0.05] hover:border-nhubx-glow-primary/20",
    outline: "border border-nhubx-glow-primary/40 text-nhubx-glow-primary hover:bg-nhubx-glow-primary hover:text-white shadow-[0_0_12px_rgba(255,60,0,0.08)] hover:shadow-glow"
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.06, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
