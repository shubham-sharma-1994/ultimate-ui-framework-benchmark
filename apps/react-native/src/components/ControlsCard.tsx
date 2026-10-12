import React, { useState } from 'react';
import { View, Switch, StyleSheet, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { AnimatedView } from './AnimatedView';
import { AnimatedText } from './AnimatedText';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Motion, Theme } from '../constants/Theme';
import { useTheme } from './ThemeProvider';

const chips = ['Low', 'Medium', 'High'];

export const ControlsCard = () => {
  const [notifications, setNotifications] = useState(false);
  const [intensity, setIntensity] = useState(50);
  const [selectedChip, setSelectedChip] = useState('Medium');
  const { colors, isDark } = useTheme();

  return (
    <AnimatedView bgKey="surface" style={styles.card}>
      {/* Switch */}
      <View style={styles.row}>
        <AnimatedText type="body">Notifications</AnimatedText>
        <Switch
          testID="switch"
          accessibilityLabel="switch"
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: colors.surfaceAlt, true: colors.primary }}
          thumbColor={colors.background}
        />
      </View>

      {/* Slider */}
      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}>
          <AnimatedText type="body">Intensity</AnimatedText>
          <AnimatedText type="label">{Math.round(intensity)}</AnimatedText>
        </View>
        <Slider
          testID="slider"
          accessibilityLabel="slider"
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={100}
          value={intensity}
          onValueChange={setIntensity}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surfaceAlt}
          thumbTintColor={colors.primary}
        />
      </View>

      {/* Chips */}
      <View style={styles.chipsRow}>
        {chips.map(chip => (
          <Chip
            key={chip}
            label={chip}
            isSelected={selectedChip === chip}
            onPress={() => setSelectedChip(chip)}
            testID={`chip-${chip.toLowerCase()}`}
          />
        ))}
      </View>
    </AnimatedView>
  );
};

const Chip = ({ label, isSelected, onPress, testID }: { label: string, isSelected: boolean, onPress: () => void, testID: string }) => {
  const { colors, isDark } = useTheme();

  // Animate fill to primary in fast
  const bgStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isSelected ? colors.primary : 'transparent',
        Motion.fast
      ),
      borderColor: withTiming(
        isSelected ? colors.primary : colors.outline,
        Motion.fast
      )
    };
  });

  return (
    <Pressable testID={testID} accessibilityLabel={testID} onPress={onPress}>
      <Animated.View style={[styles.chip, bgStyle]}>
        <AnimatedText
          type="label"
          style={{ color: isSelected ? colors.background : colors.text }}
        >
          {label}
        </AnimatedText>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 1, // e1
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  }
});
