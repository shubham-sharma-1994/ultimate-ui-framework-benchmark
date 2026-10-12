import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolate
} from 'react-native-reanimated';
import { AnimatedText } from './AnimatedText';
import { AnimatedView } from './AnimatedView';
import { Motion } from '../constants/Theme';

export const Accordion = () => {
  const [expanded, setExpanded] = useState(false);
  const progress = useSharedValue(0);

  const toggle = () => {
    const nextState = !expanded;
    setExpanded(nextState);
    progress.value = withTiming(nextState ? 1 : 0, Motion.base);
  };

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` }]
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(progress.value, [0, 1], [0, 100]), // Approx height
      opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0, 1]), // Fades in last 50%
      overflow: 'hidden'
    };
  });

  return (
    <AnimatedView bgKey="surfaceAlt" style={styles.container}>
      <Pressable testID="accordion" accessibilityLabel="accordion" onPress={toggle} style={styles.header}>
        <AnimatedText type="title">Details</AnimatedText>
        <Animated.View style={chevronStyle}>
          <AnimatedText type="title">▼</AnimatedText>
        </Animated.View>
      </Pressable>
      <Animated.View style={contentStyle}>
        <View style={styles.content}>
          <AnimatedText type="body">This is the expandable content that fades in during the last 50% of the height animation.</AnimatedText>
        </View>
      </Animated.View>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  content: {
    padding: 16,
    paddingTop: 0,
  }
});
