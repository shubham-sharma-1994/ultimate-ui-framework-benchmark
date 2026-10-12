import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  FadeInUp
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { AnimatedText } from './AnimatedText';
import { Motion } from '../constants/Theme';
import { useTheme } from './ThemeProvider';

export type ItemData = {
  id: number;
  title: string;
  subtitle: string;
  score: number;
  colors: [string, string];
  body: string;
};

interface ListItemProps {
  item: ItemData;
  index: number;
}

export const ListItem: React.FC<ListItemProps> = ({ item, index }) => {
  const { colors } = useTheme();

  return (
    <Link href={`/detail/${item.id}`} asChild>
      <Pressable testID={`item-${item.id}`} accessibilityLabel={`item-${item.id}`}>
        <Animated.View
          entering={(FadeInUp as any).delay(index * Motion.staggerStep).duration(Motion.slow.duration).springify().withInitialValues({ transform: [{ translateY: 24 }] })}
          style={styles.container}
        >
          {/* Shared Element Hero Thumbnail */}
          <Animated.View sharedTransitionTag={`hero-${item.id}`}>
            <LinearGradient
              colors={item.colors}
              style={styles.thumbnail}
            />
          </Animated.View>

          <View style={styles.textContainer}>
            <AnimatedText type="title">{item.title}</AnimatedText>
            <AnimatedText type="body" colorKey="textSecondary">{item.subtitle}</AnimatedText>
          </View>

          <AnimatedText type="body" colorKey="textSecondary" style={styles.chevron}>›</AnimatedText>
        </Animated.View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 16,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  chevron: {
    fontSize: 24,
    lineHeight: 24,
  }
});
