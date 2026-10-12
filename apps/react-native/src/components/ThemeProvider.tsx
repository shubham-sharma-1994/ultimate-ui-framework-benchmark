import React, { createContext, useContext, useState, useMemo } from 'react';
import { Theme } from '../constants/Theme';
import { useSharedValue, withTiming, SharedValue } from 'react-native-reanimated';

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof Theme.light;
  themeValue: SharedValue<number>;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const themeValue = useSharedValue<number>(0);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      themeValue.value = withTiming(next ? 1 : 0, { duration: 500 });
      return next;
    });
  };

  const colors = isDark ? Theme.dark : Theme.light;

  const value = useMemo(() => ({ isDark, toggleTheme, colors, themeValue }), [isDark, colors, themeValue]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
