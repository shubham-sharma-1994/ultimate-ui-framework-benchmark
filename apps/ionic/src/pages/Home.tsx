import React, { useRef, useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ThemeToggle from '../components/ThemeToggle';
import Orbit from '../components/Orbit';
import Counter from '../components/Counter';
import Controls from '../components/Controls';
import TextField from '../components/TextField';
import ItemList from '../components/ItemList';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = (e: CustomEvent) => {
    const isScrolled = e.detail.scrollTop > 0;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  };

  return (
    <IonPage>
      {/* App Bar */}
      <IonHeader className={scrolled ? 'scrolled-header' : ''} style={{ transition: 'box-shadow 0.15s cubic-bezier(0.2, 0, 0, 1)' }}>
        <IonToolbar>
          <IonTitle className="font-semibold">Pulse</IonTitle>
          <div slot="end" className="pr-2">
            <ThemeToggle />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollEvents={true} onIonScroll={handleScroll}>
        <motion.div
          className="flex flex-col gap-4 p-4 pb-8"
          initial={{ opacity: 0, x: -30 }} // Part of page transition (sliding out left 10% on exit, coming in here)
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0.6, x: '-10%' }}
          transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* Hero Card */}
          <div className="h-[180px] rounded-[20px] p-6 flex items-center justify-between overflow-hidden relative shadow-e1" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}>
            <span className="text-title text-white z-10 w-1/2">Same app. Every framework.</span>
            <div className="z-10">
              <Orbit />
            </div>
          </div>

          {/* Counter */}
          <Counter />

          {/* Controls */}
          <Controls />

          {/* Text Field */}
          <TextField />

          {/* Item List */}
          <ItemList />

        </motion.div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
