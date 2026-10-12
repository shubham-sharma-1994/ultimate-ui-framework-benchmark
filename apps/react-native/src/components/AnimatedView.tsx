import React from 'react';
import Animated, { useAnimatedStyle, interpolateColor } from 'react-native-reanimated';
import { ViewProps, ViewStyle } from 'react-native';
import { useTheme } from './ThemeProvider';
import { Theme } from '../constants/Theme';

interface AnimatedViewProps extends ViewProps {
  bgKey?: keyof typeof Theme.light;
  style?: ViewStyle | ViewStyle[] | any;
  children?: React.ReactNode;
  entering?: any;
  exiting?: any;
}

export const AnimatedView: React.FC<AnimatedViewProps> = ({ bgKey = 'background', style, entering, exiting, ...props }) => {
  const { themeValue } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        themeValue.value,
        [0, 1],
        [Theme.light[bgKey], Theme.dark[bgKey]]
      )
    };
  });

  return <Animated.View entering={entering} exiting={exiting} style={[animatedStyle, style]} {...props} />;
};
