import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IonIcon } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';

interface Item {
  id: number;
  title: string;
  subtitle: string;
  score: number;
  colors: string[];
  body: string;
}

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const router = useIonRouter();

  useEffect(() => {
    import('../data/data.json').then((data) => setItems(data.items));
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.05, 0.7, 0.1, 1] as const } // slow
    },
  };

  const handleItemClick = (id: number) => {
    router.push(`/detail/${id}`, 'forward', 'push');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "100px" }}
      className="flex flex-col gap-4"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          id={`item-${item.id}`}
          data-testid={`item-${item.id}`}
          variants={itemVariants}
          onClick={() => handleItemClick(item.id)}
          className="flex items-center gap-4 p-2 -mx-2 rounded-card cursor-pointer hover:bg-surfaceAlt transition-colors duration-150"
        >
          {/* Thumbnail - Shared Element anchor */}
          <motion.div
            layoutId={`hero-thumb-${item.id}`}
            className="w-14 h-14 rounded-[16px] shrink-0"
            style={{
              background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})`,
            }}
          />

          <div className="flex-1 flex flex-col justify-center">
            <span className="text-body font-medium text-text">{item.title}</span>
            <span className="text-label text-textMuted">{item.subtitle}</span>
          </div>

          <IonIcon icon={chevronForwardOutline} className="text-textMuted text-xl" />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ItemList;
