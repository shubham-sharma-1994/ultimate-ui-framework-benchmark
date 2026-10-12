import React, { useState } from 'react';
import { IonToggle, IonRange } from '@ionic/react';
import { motion } from 'framer-motion';

const Controls: React.FC = () => {
  const [intensity, setIntensity] = useState(50);
  const [selectedChip, setSelectedChip] = useState('Low');

  const chips = ['Low', 'Medium', 'High'];

  return (
    <div className="bg-surface rounded-card p-6 shadow-e1 flex flex-col gap-6">
      {/* Switch */}
      <div className="flex items-center justify-between">
        <span className="text-body text-text">Notifications</span>
        <IonToggle id="switch" data-testid="switch" color="primary" />
      </div>

      {/* Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-body text-text">Intensity</span>
          <span className="text-label text-primary">{intensity}</span>
        </div>
        <IonRange
          id="slider"
          data-testid="slider"
          min={0}
          max={100}
          value={intensity}
          onIonChange={(e) => setIntensity(e.detail.value as number)}
          color="primary"
          style={{ padding: 0 }}
        />
      </div>

      {/* Chips */}
      <div className="flex gap-3">
        {chips.map((chip) => {
          const isSelected = selectedChip === chip;
          return (
            <button
              key={chip}
              id={`chip-${chip.toLowerCase()}`}
              data-testid={`chip-${chip.toLowerCase()}`}
              onClick={() => setSelectedChip(chip)}
              className={`relative px-4 py-2 rounded-chip text-label overflow-hidden transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] ${
                isSelected ? 'text-onPrimary' : 'text-text bg-surfaceAlt'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="chip-active"
                  className="absolute inset-0 bg-primary z-0 rounded-chip"
                  transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
                />
              )}
              <span className="relative z-10">{chip}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Controls;
