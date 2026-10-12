import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  FadeIn
} from 'react-native-reanimated';
import { AnimatedView } from './AnimatedView';
import { AnimatedText } from './AnimatedText';
import { Motion } from '../constants/Theme';

const SwipeItem = ({ id, onDismiss }: { id: number; onDismiss: (id: number) => void }) => {
  const translateX = useSharedValue(0);
  const height = useSharedValue(56);
  const opacity = useSharedValue(1);
  const margin = useSharedValue(8);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      // Only allow swipe left (or both, spec says horizontal swipe > 40%)
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      // Screen width approx 400 for threshold logic, or relative to container
      if (Math.abs(event.translationX) > 100) { // arbitrary > 40% threshold for simple implementation
        const direction = Math.sign(event.translationX);
        translateX.value = withTiming(direction * 500, Motion.base, () => {
          height.value = withTiming(0, Motion.base);
          margin.value = withTiming(0, Motion.base);
          opacity.value = withTiming(0, Motion.base, () => {
            runOnJS(onDismiss)(id);
          });
        });
      } else {
        translateX.value = withTiming(0, Motion.base);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
    marginBottom: margin.value,
  }));

  return (
    <Animated.View style={[styles.itemContainer, containerStyle]}>
      <View style={styles.backgroundLayer}>
        <AnimatedText type="body" style={{ color: 'white' }}>Delete</AnimatedText>
      </View>
      <GestureDetector gesture={panGesture}>
        <AnimatedView bgKey="surface" style={[styles.foregroundLayer, animatedStyle]} testID={`swipe-${id}`} accessibilityLabel={`swipe-${id}`}>
          <AnimatedText type="body">Swipe me {id}</AnimatedText>
        </AnimatedView>
      </GestureDetector>
    </Animated.View>
  );
};

export const SwipeList = () => {
  const initialItems = [1, 2, 3];
  const [items, setItems] = useState(initialItems);

  const handleDismiss = (id: number) => {
    setItems(prev => prev.filter(item => item !== id));
  };

  const reset = () => setItems(initialItems);

  return (
    <View style={styles.container}>
      {items.map(id => (
        <SwipeItem key={id} id={id} onDismiss={handleDismiss} />
      ))}
      {items.length === 0 && (
        <Animated.View entering={FadeIn}>
          <Pressable onPress={reset} testID="swipe-reset" accessibilityLabel="swipe-reset" style={styles.resetBtn}>
            <AnimatedText type="body" colorKey="primary">Reset</AnimatedText>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  itemContainer: {
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#E5484D',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  foregroundLayer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resetBtn: {
    padding: 16,
    alignItems: 'center',
  }
});
