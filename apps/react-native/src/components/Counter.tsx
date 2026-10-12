import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { AnimatedText } from './AnimatedText';
import { Motion } from '../constants/Theme';
import { AnimatedView } from './AnimatedView';

export const Counter = () => {
  const [count, setCount] = useState(0);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  // For the number animation
  const currentKey = count;

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.96, Motion.fast),
      withTiming(1, Motion.fast)
    );
    setCount(c => c + 1);
  };

  const handleLongPress = () => {
    // Shake animation
    translateX.value = withSequence(
      withTiming(6, { duration: 50 }),
      withTiming(-6, { duration: 100 }),
      withTiming(6, { duration: 100 }),
      withTiming(0, { duration: 50 }),
    );
    runOnJS(setCount)(0);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AnimatedText type="label" colorKey="textSecondary">Taps</AnimatedText>
        <Animated.View style={[styles.numberWrapper, shakeStyle]}>
          <Animated.Text
            key={currentKey}
            style={styles.numberText}
            // Basic approximation of slide up and fade out using Reanimated's layout animations
            // Note: Since we are recreating the text, Reanimated entering/exiting is perfect here
            entering={(Animated as any).SlideInDown.duration(Motion.base.duration)}
            exiting={(Animated as any).SlideOutUp.duration(Motion.base.duration).withCallback(() => {})}
          >
            {count}
          </Animated.Text>
        </Animated.View>
      </View>

      <Animated.View style={buttonStyle}>
        <Pressable
          testID="counter-inc"
          accessibilityLabel="counter-inc"
          onPress={handlePress}
          onLongPress={handleLongPress}
        >
          <AnimatedView bgKey="primary" style={styles.fab}>
            <AnimatedText type="title" colorKey="background" style={{ color: '#fff', alignSelf: 'center' }}>+</AnimatedText>
          </AnimatedView>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  textContainer: {
    flexDirection: 'column',
  },
  numberWrapper: {
    height: 40,
    overflow: 'hidden',
  },
  numberText: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: '#111013', // Will be overridden or ignored depending on theme, simplified here.
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
