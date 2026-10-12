import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TextField: React.FC = () => {
  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative pt-4">
        {/* Outline */}
        <motion.div
          className="absolute inset-0 top-4 rounded-input border-2 pointer-events-none"
          animate={{
            borderColor: focused ? 'var(--color-primary)' : 'var(--color-outline)',
          }}
          transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
        />

        {/* Floating Label */}
        <motion.label
          htmlFor="name-input"
          className="absolute left-4 px-1 bg-background text-textMuted z-10 origin-left"
          animate={{
            y: focused || name ? -24 : 12,
            scale: focused || name ? 0.75 : 1,
            color: focused ? 'var(--color-primary)' : 'var(--color-textMuted)',
          }}
          transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
        >
          Your name
        </motion.label>

        {/* Input */}
        <input
          id="name-input"
          data-testid="name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent outline-none px-4 py-3 text-body text-text relative z-20"
        />
      </div>

      {/* Greeting */}
      <div className="h-6">
        <AnimatePresence mode="wait">
          {name && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
              className="text-body text-text"
            >
              Hello, {name}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TextField;
