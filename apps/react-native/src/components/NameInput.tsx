import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { useTheme } from './ThemeProvider';
import { Motion } from '../constants/Theme';
import { AnimatedText } from './AnimatedText';

export const NameInput = () => {
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useTheme();

  // Animation values
  const focusAnim = useSharedValue(0);

  React.useEffect(() => {
    focusAnim.value = withTiming(isFocused || name ? 1 : 0, Motion.fast);
  }, [isFocused, name]);

  const labelStyle = useAnimatedStyle(() => {
    return {
      top: interpolate(focusAnim.value, [0, 1], [18, -10]),
      fontSize: interpolate(focusAnim.value, [0, 1], [16, 12]),
      color: focusAnim.value === 1 ? colors.primary : colors.textSecondary,
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    return {
      borderColor: focusAnim.value === 1 ? colors.primary : colors.outline,
      borderWidth: focusAnim.value === 1 ? 2 : 1,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputContainer, borderStyle]}>
        <Animated.Text style={[styles.label, labelStyle]}>
          Your name
        </Animated.Text>
        <TextInput
          testID="name-input"
          accessibilityLabel="name-input"
          style={[styles.input, { color: colors.text }]}
          value={name}
          onChangeText={setName}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Animated.View>

      {/* Greeting Mirror */}
      <View style={styles.greetingContainer}>
        {name ? (
          <Animated.View
            entering={(Animated as any).FadeIn.duration(Motion.fast.duration)}
            exiting={(Animated as any).FadeOut.duration(Motion.fast.duration)}
          >
            <AnimatedText type="body">Hello, {name}</AnimatedText>
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    height: 56,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  label: {
    position: 'absolute',
    left: 16,
    backgroundColor: 'transparent', // The spec says outline animates, floating label normally needs solid bg, omitting bg for simplicity unless needed
  },
  input: {
    fontSize: 16,
    height: '100%',
    paddingTop: 10,
  },
  greetingContainer: {
    minHeight: 24,
    marginTop: 8,
  }
});
