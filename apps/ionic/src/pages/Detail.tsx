import React, { useEffect, useState, useRef } from 'react';
import { IonContent, IonPage, IonIcon, IonButton, useIonRouter } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

import ProgressRing from '../components/ProgressRing';
import Accordion from '../components/Accordion';
import DragCard from '../components/DragCard';
import SwipeList from '../components/SwipeList';
import ButtonsRow from '../components/ButtonsRow';
import Shimmer from '../components/Shimmer';

interface Item {
  id: number;
  title: string;
  subtitle: string;
  score: number;
  colors: string[];
  body: string;
}

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useIonRouter();
  const [item, setItem] = useState<Item | null>(null);

  // For scroll effects on standard div (since Ionic IonContent scroll events with Framer Motion useScroll can be tricky,
  // we'll use a local ref for a scrollable container, OR just use IonContent onIonScroll).
  // Parallax: background moves at 0.5x scroll speed. Header collapses 240 -> 56.
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!id) return;
    import('../data/data.json').then((data) => {
      const found = data.items.find((i: Item) => i.id === parseInt(id, 10));
      if (found) setItem(found);
    });
  }, [id]);

  if (!item) return null;

  // Calculate parallax and header styles
  const headerExpandedHeight = 240;
  const headerCollapsedHeight = 56;
  const scrollRange = headerExpandedHeight - headerCollapsedHeight; // 184

  const progress = Math.min(Math.max(scrollY / scrollRange, 0), 1);
  const headerHeight = headerExpandedHeight - (progress * scrollRange);
  const bgY = scrollY * 0.5;
  const titleScale = 1 - (progress * ((32 - 20) / 32)); // 32 -> 20 (approx 0.625)
  // When collapsed, title is centered in the app bar. When expanded, it's at the bottom left.
  const titleY = progress * -80; // approximate travel
  const titleX = progress * 40;

  return (
    <IonPage>
      {/*
        Page Transition: Slide in from right 30% + fade 0->1 in base (300ms)
      */}
      <motion.div
        className="w-full h-full bg-background flex flex-col absolute inset-0"
        initial={{ x: '30%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '30%', opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Header - Fixed at top, changes height */}
        <div
          className="relative w-full z-20 overflow-hidden flex-shrink-0 shadow-e1"
          style={{ height: headerHeight, backgroundColor: 'var(--color-surface)' }}
        >
          {/* Parallax Background using Hero colors */}
          <motion.div
            className="absolute inset-0 w-full"
            style={{
              height: headerExpandedHeight,
              y: -bgY,
              background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})`
            }}
            layoutId={`hero-thumb-${item.id}`} // Shared element thumbnail -> header bg
          />

          {/* App Bar Controls */}
          <div className="absolute top-0 left-0 w-full h-[56px] flex items-center px-2 z-30">
            <IonButton
              id="back"
              data-testid="back"
              fill="clear"
              className="text-white"
              style={{ '--color': 'white' }}
              onClick={() => router.goBack()}
            >
              <IonIcon icon={arrowBackOutline} slot="icon-only" />
            </IonButton>
          </div>

          {/* Title Text */}
          <motion.div
            className="absolute bottom-4 left-14 z-30 origin-bottom-left text-white font-bold"
            style={{
              fontSize: '32px',
              y: titleY,
              x: titleX,
              scale: titleScale
            }}
          >
            {item.title}
          </motion.div>
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto"
          onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
        >
          <div className="flex flex-col gap-8 p-4 pb-12">

            {/* Progress Ring */}
            <div className="flex justify-center mt-4">
              <ProgressRing score={item.score} />
            </div>

            {/* Accordion */}
            <Accordion body={item.body} />

            {/* Drag Card */}
            <DragCard />

            {/* Swipe List */}
            <SwipeList />

            {/* Buttons Row */}
            <ButtonsRow />

            {/* Shimmer */}
            <Shimmer body={item.body} />

          </div>
        </div>
      </motion.div>
    </IonPage>
  );
};

export default Detail;
