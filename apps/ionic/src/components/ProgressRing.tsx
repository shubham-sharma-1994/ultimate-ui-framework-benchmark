import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  score: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ score }) => {
  const [key, setKey] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);

  const radius = 54; // 120px total with 12px stroke -> 120 - 12 = 108 / 2 = 54
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Count up animation logic
    let startTimestamp: number | null = null;
    const duration = 500; // slow = 500ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // easeOutCubic roughly matches slow curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayScore(Math.floor(easeProgress * score));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [key, score]);

  return (
    <div
      className="relative w-[120px] h-[120px] flex items-center justify-center cursor-pointer"
      onClick={() => setKey(k => k + 1)}
      id="ring"
      data-testid="ring"
    >
      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
        {/* Background ring */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="var(--color-surfaceAlt)"
          strokeWidth="12"
          fill="none"
        />
        {/* Progress ring */}
        <motion.circle
          key={key}
          cx="60"
          cy="60"
          r={radius}
          stroke="var(--color-primary)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
          transition={{ duration: 0.5, ease: [0.05, 0.7, 0.1, 1] }} // slow
        />
      </svg>
      <span className="text-display text-text font-bold z-10">{displayScore}%</span>
    </div>
  );
};

export default ProgressRing;
