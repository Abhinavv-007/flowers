import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Linkedin, Instagram, Github, MousePointer2 } from 'lucide-react';

interface GardenUIProps {
  started: boolean;
  onReset: () => void;
}

export const GardenUI: React.FC<GardenUIProps> = ({ started, onReset }) => {
  return (
    <AnimatePresence>
      {started && (
        <motion.div
          className="absolute inset-0 z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
            <div className="flex flex-col">
              <h2 className="font-script text-3xl text-rose-300 drop-shadow-md">My Garden</h2>
            </div>

            <div className="pointer-events-auto flex gap-4">
              <button
                onClick={onReset}
                className="p-3 rounded-full bg-rose-950/30 border border-rose-500/20 text-rose-300 hover:bg-rose-900/50 hover:text-white hover:border-rose-400 transition-all duration-300 backdrop-blur-sm group"
                title="Clear Garden"
              >
                <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>

          {/* Social Footer - Monochromatic Rose Aesthetic */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6 pointer-events-auto z-50">
            <a
              href="https://www.linkedin.com/in/abhnv07/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 transition-all duration-300 hover:scale-110"
              title="LinkedIn"
            >
              <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-rose-900/20 border border-rose-500/30 backdrop-blur-sm transition-all duration-300 group-hover:bg-rose-800/40 group-hover:border-rose-400/60 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <Linkedin size={20} className="text-rose-300 group-hover:text-rose-100 transition-colors" strokeWidth={1.5} />
              </div>
            </a>

            <a
              href="https://www.instagram.com/abhinavv.007/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 transition-all duration-300 hover:scale-110"
              title="Instagram"
            >
              <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-rose-900/20 border border-rose-500/30 backdrop-blur-sm transition-all duration-300 group-hover:bg-rose-800/40 group-hover:border-rose-400/60 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <Instagram size={20} className="text-rose-300 group-hover:text-rose-100 transition-colors" strokeWidth={1.5} />
              </div>
            </a>

            <a
              href="https://github.com/Abhinavv-007/flowers"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 transition-all duration-300 hover:scale-110"
              title="GitHub"
            >
              <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-rose-900/20 border border-rose-500/30 backdrop-blur-sm transition-all duration-300 group-hover:bg-rose-800/40 group-hover:border-rose-400/60 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <Github size={20} className="text-rose-300 group-hover:text-rose-100 transition-colors" strokeWidth={1.5} />
              </div>
            </a>
          </div>

          {/* Hint */}
          <div className="absolute bottom-20 left-0 right-0 text-center pointer-events-none">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 2, duration: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-rose-500/10 text-rose-200/60 text-sm font-serif"
            >
              <MousePointer2 size={14} />
              <span>Tap to plant flowers</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};