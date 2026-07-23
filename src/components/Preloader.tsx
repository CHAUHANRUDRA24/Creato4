import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PreloaderPhase } from '../types';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<PreloaderPhase>(1);

  useEffect(() => {
    // Prevent scrolling while preloader runs
    document.body.style.overflow = 'hidden';

    const timer1 = setTimeout(() => setPhase(2), 300);   // 0.3s
    const timer2 = setTimeout(() => setPhase(3), 800);   // 0.8s
    const timer3 = setTimeout(() => setPhase(4), 1600);  // 1.6s
    const timer4 = setTimeout(() => setPhase(5), 2200);  // 2.2s
    const timer5 = setTimeout(() => {
      document.body.style.overflow = 'unset';
      onComplete();
    }, 2500);                                            // 2.5s

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      document.body.style.overflow = 'unset';
    };
  }, [onComplete]);

  const badges = [
    { label: 'PRODUCT', pos: 'top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2', zIndex: 10, zOffset: 40 },
    { label: 'MECHANICAL', pos: 'top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2', zIndex: 20, zOffset: 30 },
    { label: 'ELECTRONICS', pos: 'bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2', zIndex: 30, zOffset: 20 },
    { label: 'EMBEDDED', pos: 'bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2', zIndex: 40, zOffset: 10 },
    { label: 'SOFTWARE', pos: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', zIndex: 50, zOffset: 0 },
  ];

  return (
    <AnimatePresence>
      <motion.div
        key="preloader"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 5 ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#FAF8F5] text-[#1A3C2F] pointer-events-none select-none overflow-hidden"
      >
        {/* Phase 2 & 3: Badge System */}
        {(phase === 2 || phase === 3) && (
          <div className="relative w-full max-w-2xl h-80 flex items-center justify-center perspective-1000">
            {badges.map((badge, index) => {
              const isCollapsing = phase === 3;
              return (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{
                    opacity: isCollapsing ? 0.35 : 1,
                    scale: isCollapsing ? 0.9 : 1,
                    x: isCollapsing ? 0 : undefined,
                    y: isCollapsing ? 0 : undefined,
                    z: isCollapsing ? 0 : badge.zOffset,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: phase === 2 ? index * 0.08 : 0,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`absolute ${
                    isCollapsing
                      ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                      : badge.pos
                  } px-5 py-2.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] font-semibold text-xs tracking-[0.2em] shadow-lg border border-[#FAF8F5]/20 flex items-center gap-2`}
                  style={{ zIndex: badge.zIndex }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4A35A]" />
                  {badge.label}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Phase 4: Brand Reveal */}
        {phase === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center px-4"
          >
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#1A3C2F]"
            >
              CREATO4
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
              className="text-2xl md:text-3xl font-bold text-[#1A3C2F] mt-1 tracking-widest opacity-90"
            >
              PRODUCT & TECH LAB
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
              className="mt-4 flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.25em] text-[#5C6B60] font-medium"
            >
              <span>DESIGN</span>
              <span className="text-[#C4A35A] font-bold">·</span>
              <span>ENGINEER</span>
              <span className="text-[#C4A35A] font-bold">·</span>
              <span>BUILD</span>
            </motion.div>
          </motion.div>
        )}

        {/* Phase 5: Transition to Navbar */}
        {phase === 5 && (
          <motion.div
            initial={{ scale: 1, y: 0, opacity: 1 }}
            animate={{ scale: 0.6, y: -260, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col items-center"
          >
            <span className="text-4xl font-extrabold text-[#1A3C2F]">CREATO4</span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
