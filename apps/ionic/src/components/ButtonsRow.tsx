import React, { useRef, useState } from 'react';
import { IonButton, IonModal, IonToast } from '@ionic/react';
import { motion, AnimatePresence } from 'framer-motion';

const ButtonsRow: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const sheetModalRef = useRef<HTMLIonModalElement>(null);

  return (
    <>
      <div className="flex gap-2">
        <IonButton
          id="btn-dialog"
          data-testid="btn-dialog"
          fill="solid"
          color="primary"
          className="flex-1 m-0"
          style={{ '--border-radius': '14px' }}
          onClick={() => setShowDialog(true)}
        >
          Dialog
        </IonButton>
        <IonButton
          id="btn-sheet"
          data-testid="btn-sheet"
          fill="solid"
          color="secondary"
          className="flex-1 m-0"
          style={{ '--border-radius': '14px', '--background': 'var(--color-surfaceAlt)', '--color': 'var(--color-text)' }}
          onClick={() => sheetModalRef.current?.present()}
        >
          Sheet
        </IonButton>
        <IonButton
          id="btn-toast"
          data-testid="btn-toast"
          fill="solid"
          color="tertiary"
          className="flex-1 m-0"
          style={{ '--border-radius': '14px', '--background': 'var(--color-outline)', '--color': 'var(--color-text)' }}
          onClick={() => setShowToast(true)}
        >
          Toast
        </IonButton>
      </div>

      {/* Custom Dialog to match spec (scale 0.9->1 + fade, base curve, 40% scrim) */}
      {/* Note: Ionic IonAlert doesn't expose easy Framer Motion scale entrance matching spec precisely, so using custom overlay */}
      <AnimatePresence>
        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowDialog(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }} // base
              className="bg-surface p-6 rounded-card shadow-e2 z-10 w-full max-w-[320px] flex flex-col gap-4"
            >
              <h2 className="text-title text-text">Dialog Title</h2>
              <p className="text-body text-textMuted">This is a custom dialog matching the animation spec.</p>
              <div className="flex justify-end mt-2">
                <IonButton fill="clear" onClick={() => setShowDialog(false)}>OK</IonButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Sheet using Ionic IonModal with breakpoints */}
      <IonModal
        ref={sheetModalRef}
        initialBreakpoint={0.5}
        breakpoints={[0, 0.5]}
        handle={true}
        style={{ '--border-radius': '28px 28px 0 0' }}
      >
        <div className="p-6 bg-surface h-full">
          <h2 className="text-title text-text mb-4">Bottom Sheet</h2>
          <p className="text-body text-textMuted">Drag down to dismiss.</p>
        </div>
      </IonModal>

      {/* Toast */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="This is a toast notification."
        duration={2000}
        position="bottom"
        color="dark"
        style={{ '--border-radius': '8px' }}
      />
    </>
  );
};

export default ButtonsRow;
