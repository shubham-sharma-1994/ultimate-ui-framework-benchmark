import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { AnimatedView } from './AnimatedView';
import { Motion } from '../constants/Theme';

export const DragCard = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0, Motion.spring);
      translateY.value = withSpring(0, Motion.spring);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ]
  }));

  return (
    <View style={styles.playArea}>
      <GestureDetector gesture={panGesture}>
        <AnimatedView
          testID="drag-card"
          accessibilityLabel="drag-card"
          bgKey="primary"
          style={[styles.card, animatedStyle]}
        />
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  playArea: {
    height: 240,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  card: {
    width: 96,
    height: 96,
    borderRadius: 16,
  }
});
