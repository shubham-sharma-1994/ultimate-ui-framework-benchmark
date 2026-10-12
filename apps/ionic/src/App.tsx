import { Route, Navigate } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Detail from './pages/Detail';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact({
  mode: 'md', // Material Design everywhere per DESIGN.md
});

// A wrapper to handle AnimatePresence routing
const AnimatedRoutes = () => {
  return (
    // framer-motion AnimatePresence for route transitions.
    // IonRouterOutlet tries to handle its own transitions, but since we are using
    // motion components inside pages, we disable Ionic animations.
    <IonRouterOutlet animated={false}>
      <Route path="/home" element={<Home />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </IonRouterOutlet>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AnimatedRoutes />
    </IonReactRouter>
  </IonApp>
);

export default App;
