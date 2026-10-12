import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IonIcon, IonButton } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';

const SwipeList: React.FC = () => {
  const [items, setItems] = useState([1, 2, 3]);

  const handleDismiss = (id: number) => {
    setItems((prev) => prev.filter((i) => i !== id));
  };

  const handleReset = () => {
    setItems([1, 2, 3]);
  };

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item}
            id={`swipe-${item}`}
            data-testid={`swipe-${item}`}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }} // base
            className="relative"
          >
            {/* Delete Background */}
            <div className="absolute inset-0 bg-[#E5484D] rounded-card flex items-center justify-end px-6">
              <IonIcon icon={trashOutline} className="text-white text-xl" />
            </div>

            {/* Draggable surface */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 1, right: 0.1 }}
              onDragEnd={(e, info) => {
                const threshold = -window.innerWidth * 0.4;
                if (info.offset.x < threshold) {
                  handleDismiss(item);
                }
              }}
              className="bg-surface p-4 rounded-card shadow-e1 relative z-10 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-surfaceAlt flex items-center justify-center text-label text-textMuted">
                {item}
              </div>
              <span className="text-body text-text">Swipe left to dismiss</span>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {items.length < 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <IonButton
            id="swipe-reset"
            data-testid="swipe-reset"
            fill="clear"
            onClick={handleReset}
            className="w-full text-primary font-medium"
          >
            Reset
          </IonButton>
        </motion.div>
      )}
    </div>
  );
};

export default SwipeList;
