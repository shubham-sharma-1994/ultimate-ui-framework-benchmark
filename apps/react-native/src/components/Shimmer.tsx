import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { AnimatedView } from './AnimatedView';

export const Shimmer = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1200 }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
    };
  });

  return (
    <View style={styles.container} testID="shimmer" accessibilityLabel="shimmer">
      {[1, 2, 3].map(i => (
        <AnimatedView
          key={i}
          bgKey="surfaceAlt"
          style={[styles.line, { width: i === 3 ? '60%' : '100%' }, animatedStyle]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    gap: 8,
  },
  line: {
    height: 16,
    borderRadius: 8,
  }
});
