import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Linkedin, Instagram, Github } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';

interface LandingPageProps {
  started: boolean;
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ started, onStart }) => {
  return (
    <AnimatePresence>
      {!started && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-[#0f0505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8 }}
        >
          {/* Green Particle Background */}
          <div className="absolute inset-0 z-0">
            <ParticleBackground />
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mb-8 p-12 relative z-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-rose-500 blur-[80px] opacity-20 rounded-full animate-pulse"></div>
              <h1 className="font-script text-7xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-br from-rose-300 via-rose-500 to-rose-700 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)] py-6 leading-tight">
                Grow Flowers
              </h1>
            </div>
            <p className="font-serif text-rose-200/80 text-xl md:text-2xl mt-4 tracking-widest uppercase text-shadow-sm">
              A Garden of Eternal Blooms
            </p>
          </motion.div>

          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-4 bg-transparent border border-rose-500/30 rounded-full overflow-hidden transition-all duration-300 hover:border-rose-500 hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] z-50 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-900/50 to-rose-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-3 font-serif text-rose-100 text-lg">
              <Sparkles size={18} className="text-rose-400 animate-pulse" />
              <span>Plant a Seed</span>
              <Heart size={18} className="text-rose-400 fill-rose-500/20" />
            </div>
          </motion.button>

          {/* Social Media Links - Red Theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-6 z-50"
          >
            <a
              href="https://www.linkedin.com/in/abhnv07/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 transition-all duration-300 hover:scale-110"
              title="LinkedIn"
            >
              <div className="relative w-12 h-12 flex items-center justify-center rounded-lg bg-red-950/30 border border-red-500/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-red-900/50 group-hover:border-red-400/70 group-hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]">
                <Linkedin size={24} className="text-red-400 group-hover:text-red-300 transition-colors" strokeWidth={1.5} />
              </div>
            </a>

            <a
              href="https://www.instagram.com/abhinavv.007/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 transition-all duration-300 hover:scale-110"
              title="Instagram"
            >
              <div className="relative w-12 h-12 flex items-center justify-center rounded-lg bg-red-950/30 border border-red-500/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-red-900/50 group-hover:border-red-400/70 group-hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]">
                <Instagram size={24} className="text-red-400 group-hover:text-red-300 transition-colors" strokeWidth={1.5} />
              </div>
            </a>

            <a
              href="https://github.com/Abhinavv-007/flowers"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 transition-all duration-300 hover:scale-110"
              title="GitHub"
            >
              <div className="relative w-12 h-12 flex items-center justify-center rounded-lg bg-red-950/30 border border-red-500/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-red-900/50 group-hover:border-red-400/70 group-hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]">
                <Github size={24} className="text-red-400 group-hover:text-red-300 transition-colors" strokeWidth={1.5} />
              </div>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-3 text-rose-500/40 text-xs font-sans tracking-widest"
          >
            CLICK & DRAG TO CREATE MAGIC
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};