import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedView } from '../../components/AnimatedView';
import { AnimatedText } from '../../components/AnimatedText';
import { ProgressRing } from '../../components/ProgressRing';
import { Accordion } from '../../components/Accordion';
import { DragCard } from '../../components/DragCard';
import { SwipeList } from '../../components/SwipeList';
import { Overlays } from '../../components/Overlays';
import { Shimmer } from '../../components/Shimmer';
import { Motion } from '../../constants/Theme';

import data from '../../../data/data.json';

export default function DetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const item = data.items.find(i => i.id === Number(id));
  const scrollY = useSharedValue(0);
  const [showShimmer, setShowShimmer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowShimmer(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerHeight = 240;
  const minHeaderHeight = 56 + insets.top;

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: Math.max(minHeaderHeight, headerHeight - scrollY.value),
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    // scale 32->20
    const scale = interpolate(scrollY.value, [0, headerHeight - minHeaderHeight], [1, 20/32], Extrapolation.CLAMP);
    const translateY = interpolate(scrollY.value, [0, headerHeight - minHeaderHeight], [0, -(headerHeight/2 - minHeaderHeight/2)], Extrapolation.CLAMP);
    return {
      transform: [
        { translateY },
        { scale }
      ]
    };
  });

  const bgStyle = useAnimatedStyle(() => {
    // Parallax
    return {
      transform: [{ translateY: scrollY.value * 0.5 }]
    };
  });

  if (!item) return <View><AnimatedText type="body">Not found</AnimatedText></View>;

  return (
    <AnimatedView style={styles.root}>
      <Animated.View style={[styles.header, headerStyle]}>
        {/* Parallax Shared Element BG */}
        <Animated.View sharedTransitionTag={`hero-${item.id}`} style={[StyleSheet.absoluteFill, bgStyle]}>
          <LinearGradient
            colors={item.colors as [string, string]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* App Bar elements over header */}
        <View style={[styles.appBarContent, { top: insets.top }]}>
          <Pressable testID="back" accessibilityLabel="back" onPress={() => router.back()} style={styles.backBtn}>
            <AnimatedText type="title" style={{ color: 'white' }}>←</AnimatedText>
          </Pressable>
        </View>

        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <AnimatedText type="display" style={{ color: 'white' }}>{item.title}</AnimatedText>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <ProgressRing percentage={item.score} />
        <Accordion />
        <DragCard />
        <SwipeList />
        <Overlays />

        <View style={{ minHeight: 100 }}>
          {showShimmer ? (
            <Animated.View exiting={FadeOut.duration(Motion.base.duration)}>
              <Shimmer />
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn.duration(Motion.base.duration)}>
              <AnimatedText type="body">{item.body}</AnimatedText>
            </Animated.View>
          )}
        </View>
      </Animated.ScrollView>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBarContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backBtn: {
    padding: 8,
  },
  titleContainer: {
    zIndex: 5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  }
});
