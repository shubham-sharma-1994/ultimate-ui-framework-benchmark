import React, { useState, useEffect } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { moonOutline, sunnyOutline } from 'ionicons/icons';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initial theme is light
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <IonButton
      fill="clear"
      id="theme-toggle"
      data-testid="theme-toggle"
      onClick={toggleTheme}
      className="rounded-full w-12 h-12 flex items-center justify-center text-text"
      style={{ '--color': 'var(--color-text)' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.05, 0.7, 0.1, 1] }} // slow curve
        >
          <IonIcon icon={isDark ? moonOutline : sunnyOutline} style={{ fontSize: '24px' }} />
        </motion.div>
      </AnimatePresence>
    </IonButton>
  );
};

export default ThemeToggle;
