import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  useDerivedValue,
  runOnJS
} from 'react-native-reanimated';
import { AnimatedText } from './AnimatedText';
import { Motion } from '../constants/Theme';
import { useTheme } from './ThemeProvider';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProgressRing = ({ percentage }: { percentage: number }) => {
  const { colors } = useTheme();
  const progress = useSharedValue(0);
  const size = 120;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const [displayValue, setDisplayValue] = React.useState(0);

  const startAnimation = () => {
    progress.value = 0;
    progress.value = withTiming(percentage, Motion.slow);
  };

  useEffect(() => {
    startAnimation();
  }, [percentage]);

  useDerivedValue(() => {
    runOnJS(setDisplayValue)(Math.round(progress.value));
  });

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (progress.value / 100) * circumference;
    return {
      strokeDashoffset,
    };
  });

  return (
    <Pressable testID="ring" accessibilityLabel="ring" onPress={startAnimation} style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke={colors.surfaceAlt}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke={colors.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.textContainer}>
          <AnimatedText type="display">{displayValue}%</AnimatedText>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
