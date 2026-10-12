import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';

export const Orbit = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container} testID="orbit" accessibilityLabel="orbit">
      <View style={styles.ring} />
      <Animated.View style={[styles.orbitingContainer, animatedStyle]}>
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    position: 'absolute',
  },
  orbitingContainer: {
    width: 80,
    height: 80,
    position: 'absolute',
  },
  dot: {
    width: 12, // r=6 -> d=12
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    position: 'absolute',
  },
  dot1: { top: -6, left: 34 },
  dot2: { bottom: 10, left: 0 },
  dot3: { bottom: 10, right: 0 },
});
