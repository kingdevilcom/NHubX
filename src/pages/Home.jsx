import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const Home = () => {

  useEffect(() => {
    document.title = "NHubX | Modern Digital Solutions";
  }, []);

  // animations
  const containerVariants = {
    hidden: {
      opacity: 0
    },

    visible: {
      opacity: 1,

      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 15
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div className="relative h-screen flex flex-col justify-between overflow-hidden select-none">

      {/* glow */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.08, 0.13, 0.08]
        }}

        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut"
        }}

        className="absolute top-[-10%] left-[-15%] w-[60rem] h-[40rem] bg-gradient-to-br from-[#ff3c00]/[0.08] to-transparent blur-[130px] rounded-full -z-10 pointer-events-none"
      />

      {/* floating glass */}
      <motion.div
        initial={{
          opacity: 0,
          x: 50
        }}

        animate={{
          opacity: 0.08,
          x: 0,
          y: [0, -12, 0],
          rotate: [0, 1.5, 0]
        }}

        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],

          y: {
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut"
          },

          rotate: {
            repeat: Infinity,
            duration: 11,
            ease: "easeInOut"
          }
        }}

        className="absolute right-[8%] top-[25%] w-[25rem] h-[25rem] bg-white/[0.01] border border-white/[0.04] rounded-2xl -z-10"
      />

      {/* floating circle */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8
        }}

        animate={{
          opacity: 0.04,
          scale: 1,
          y: [0, 12, 0]
        }}

        transition={{
          duration: 1.5,
          ease: [0.16, 1, 0.3, 1],

          y: {
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut"
          }
        }}

        className="absolute left-[5%] bottom-[12%] w-[16rem] h-[16rem] bg-white/[0.01] border border-white/[0.03] rounded-full -z-10"
      />

      {/* hero */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 text-center mt-12">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-2xl"
        >

          {/* title */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter mb-4 uppercase leading-none text-white"
          >

            NHUB

            <motion.span
              animate={{
                textShadow: [
                  "0 0 12px rgba(255, 60, 0, 0.55)",
                  "0 0 25px rgba(255, 60, 0, 0.85)",
                  "0 0 12px rgba(255, 60, 0, 0.55)"
                ]
              }}

              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut"
              }}

              className="text-[#ff3c00] glow-text-primary"
            >

              X

            </motion.span>

          </motion.h1>

          {/* subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-gray-400 font-medium tracking-wide mb-10"
          >

            One Hub.{' '}

            <span className="text-white font-semibold">
              Infinite Power.
            </span>

          </motion.p>

          {/* buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-row gap-4 justify-center items-center"
          >

            <Link to="/projects">

              <Button
                variant="primary"
                className="px-7 py-3 text-xs tracking-wider rounded-lg"
              >

                Explore Projects

              </Button>

            </Link>

            <Button
              variant="secondary"
              className="px-7 py-3 text-xs tracking-wider border-white/20 text-white rounded-lg bg-transparent hover:bg-white/5"
            >

              View Docs

            </Button>

          </motion.div>

        </motion.div>

      </div>

    </div>
  );
};

export default Home;
