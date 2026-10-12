import React from 'react';
import { motion } from 'framer-motion';

const Orbit: React.FC = () => {
  return (
    <div id="orbit" data-testid="orbit" className="relative w-20 h-20 flex items-center justify-center">
      {/* Ring: r=40 -> diameter=80, so it matches the container */}
      <div className="absolute w-20 h-20 rounded-full border-2 border-white/30" />

      {/* Container to rotate dots */}
      <motion.div
        className="absolute w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
      >
        {/* Dot 1 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
        {/* Dot 2 */}
        <div className="absolute bottom-4 left-0 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white rounded-full" />
        {/* Dot 3 */}
        <div className="absolute bottom-4 right-0 translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white rounded-full" />
      </motion.div>
    </div>
  );
};

export default Orbit;
