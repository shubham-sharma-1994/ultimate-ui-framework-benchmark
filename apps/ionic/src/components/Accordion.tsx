import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IonIcon } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';

interface AccordionProps {
  body: string;
}

const Accordion: React.FC<AccordionProps> = ({ body }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-surface rounded-card shadow-e1 overflow-hidden" id="accordion" data-testid="accordion">
      <div
        className="p-4 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-title text-text">Details</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }} // base
        >
          <IonIcon icon={chevronDownOutline} className="text-xl text-textMuted" />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }} // base
            className="overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              // Content fades in last 50%
              transition={{ duration: 0.15, delay: 0.15, ease: 'linear' }}
              className="p-4 pt-0 text-body text-textMuted"
            >
              {body}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
