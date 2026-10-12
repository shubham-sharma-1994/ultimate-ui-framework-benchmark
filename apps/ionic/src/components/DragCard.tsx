import React from 'react';
import { motion } from 'framer-motion';

const DragCard: React.FC = () => {
  return (
    <div className="w-full h-[240px] bg-surfaceAlt rounded-card relative flex items-center justify-center overflow-hidden border-2 border-dashed border-outline">
      <motion.div
        id="drag-card"
        data-testid="drag-card"
        drag
        dragConstraints={{ top: -72, bottom: 72, left: -72, right: 72 }} // 240 play area - 96 card = 144 / 2 = 72
        dragElastic={0}
        dragTransition={{
          power: 0,
          // Fallback to slow with overshoot if native spring not supported in Framer dragTransition directly easily,
          // but Framer Motion supports springs out of the box.
          timeConstant: 300,
          modifyTarget: (target) => 0, // Force return to center
        }}
        animate={{ x: 0, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 1
        }}
        className="w-[96px] h-[96px] bg-primary rounded-[20px] shadow-e2 flex items-center justify-center text-onPrimary font-bold text-label cursor-grab active:cursor-grabbing"
      >
        Drag me
      </motion.div>
    </div>
  );
};

export default DragCard;
