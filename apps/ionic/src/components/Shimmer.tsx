import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShimmerProps {
  body: string;
}

const Shimmer: React.FC<ShimmerProps> = ({ body }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="shimmer" data-testid="shimmer" className="min-h-[100px] relative">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }} // base
            className="flex flex-col gap-3"
          >
            {[1, 0.8, 0.6].map((width, i) => (
              <div
                key={i}
                className="h-4 bg-surfaceAlt rounded overflow-hidden relative"
                style={{ width: `${width * 100}%` }}
              >
                <motion.div
                  className="absolute inset-0 z-10 w-1/2"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                  }}
                  animate={{
                    x: ['-100%', '300%']
                  }}
                  transition={{
                    duration: 1.2,
                    ease: 'linear',
                    repeat: Infinity
                  }}
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }} // base
            className="text-body text-text"
          >
            {body}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shimmer;
