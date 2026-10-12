import React, { useState } from 'react';
import { StyleSheet, Pressable, ScrollView, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { AnimatedView } from '../components/AnimatedView';
import { AnimatedText } from '../components/AnimatedText';
import { useTheme } from '../components/ThemeProvider';
import { Motion } from '../constants/Theme';

import { Orbit } from '../components/Orbit';
import { Counter } from '../components/Counter';
import { ControlsCard } from '../components/ControlsCard';
import { NameInput } from '../components/NameInput';
import { ListItem, ItemData } from '../components/ListItem';

import data from '../../data/data.json';

export default function ShowcasePage() {
  const { toggleTheme, isDark, themeValue } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const appBarStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: withTiming(scrollY.value > 0 ? 0.2 : 0, Motion.fast),
      elevation: withTiming(scrollY.value > 0 ? 4 : 0, Motion.fast),
      // bg color is handled by AnimatedView
    };
  });

  const themeIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${themeValue.value * 180}deg` }
      ],
      opacity: 1 // Cross-fade effect is typically done by rendering two icons, but here we can just rotate since it's simple string switch for now
    };
  });

  return (
    <AnimatedView style={styles.root}>
      {/* App Bar */}
      <Animated.View style={[styles.appBar, { paddingTop: insets.top }, appBarStyle]}>
        <AnimatedView bgKey="surface" style={StyleSheet.absoluteFill} />
        <View style={styles.appBarContent}>
          <AnimatedText type="title">Pulse</AnimatedText>
          <Pressable testID="theme-toggle" onPress={toggleTheme} accessibilityLabel="theme-toggle">
            <Animated.View style={themeIconStyle}>
              <AnimatedText type="title">{isDark ? '🌙' : '☀'}</AnimatedText>
            </Animated.View>
          </Pressable>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Card */}
        <LinearGradient
          colors={['#6750A4', '#473663']} // Primary -> Accent (Approximate based on Theme.light)
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <AnimatedText type="title" style={{ color: 'white' }}>Same app. Every framework.</AnimatedText>
          <Orbit />
        </LinearGradient>

        <Counter />
        <ControlsCard />
        <NameInput />

        {/* List of 6 items */}
        {data.items.map((item: any, index: number) => (
          <ListItem key={item.id} item={item as ItemData} index={index} />
        ))}
      </Animated.ScrollView>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  appBar: {
    height: 56 + 44, // rough approx for inset
    zIndex: 10,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  appBarContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },
  heroCard: {
    height: 180,
    borderRadius: 20,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  }
});
