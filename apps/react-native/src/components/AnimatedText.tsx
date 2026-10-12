import React from 'react';
import Animated, { useAnimatedStyle, interpolateColor } from 'react-native-reanimated';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from './ThemeProvider';
import { Theme } from '../constants/Theme';

interface AnimatedTextProps extends TextProps {
  colorKey?: keyof typeof Theme.light;
  type?: 'display' | 'title' | 'body' | 'label' | 'caption';
  style?: TextStyle | TextStyle[];
}

const textStyles = {
  display: { fontSize: 32, lineHeight: 40, fontWeight: '700' as const },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  label: { fontSize: 13, lineHeight: 16, fontWeight: '500' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
};

const AnimatedRNText = Animated.createAnimatedComponent(Text);

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  colorKey = 'text',
  type = 'body',
  style,
  ...props
}) => {
  const { themeValue } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        themeValue.value,
        [0, 1],
        [Theme.light[colorKey], Theme.dark[colorKey]]
      )
    };
  });

  return (
    <AnimatedRNText
      style={[textStyles[type], animatedStyle, style]}
      {...props}
    />
  );
};
