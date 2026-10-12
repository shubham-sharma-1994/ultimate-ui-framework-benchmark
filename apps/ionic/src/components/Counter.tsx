import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [shake, setShake] = useState(false);

  const handleInc = () => {
    setCount((prev) => prev + 1);
  };

  const handleReset = () => {
    setCount(0);
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  // Base transition: 300ms, cubic-bezier(0.65, 0, 0.35, 1)
  const baseTransition = { duration: 0.3, ease: [0.65, 0, 0.35, 1] as const };

  const shakeVariants = {
    shake: { x: [0, -6, 6, -6, 6, -6, 6, 0], transition: { duration: 0.3 } },
    normal: { x: 0 },
  };

  return (
    <div className="flex items-center justify-between w-full h-16">
      <div className="flex items-center gap-4">
        <span className="text-label text-textMuted">Taps</span>
        <div className="relative h-10 w-16 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={count}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={baseTransition}
              className="absolute left-0 text-display text-text"
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        id="counter-inc"
        data-testid="counter-inc"
        onClick={handleInc}
        onContextMenu={(e) => {
          e.preventDefault();
          handleReset();
        }}
        /* Long press simulation */
        onPointerDown={(e) => {
           const timer = setTimeout(() => {
             handleReset();
           }, 500);
           e.currentTarget.onpointerup = () => clearTimeout(timer);
           e.currentTarget.onpointerleave = () => clearTimeout(timer);
        }}
        variants={shakeVariants}
        animate={shake ? 'shake' : 'normal'}
        whileTap={{ scale: 0.96, transition: { duration: 0.15, ease: [0.2, 0, 0, 1] } }} // fast transition
        className="w-14 h-14 bg-primary text-onPrimary rounded-[16px] shadow-e1 flex items-center justify-center text-2xl font-bold hover:bg-opacity-90"
      >
        +
      </motion.button>
    </div>
  );
};

export default Counter;
