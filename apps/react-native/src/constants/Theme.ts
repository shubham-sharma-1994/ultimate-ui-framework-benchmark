export const Theme = {
  light: {
    primary: '#111013',
    primaryAlt: '#E1D9F0',
    accent: '#473663',
    background: '#F9F8FA',
    surface: '#FFFFFF',
    surfaceAlt: '#F0EFF4',
    text: '#111013',
    textSecondary: '#6B6674',
    outline: '#D9D3E6',
    success: '#2E9E6B',
  },
  dark: {
    primary: '#FFFFFF',
    primaryAlt: '#534C60',
    accent: '#9A82C7',
    background: '#111013',
    surface: '#1A181D',
    surfaceAlt: '#232027',
    text: '#FFFFFF',
    textSecondary: '#A9A3B3',
    outline: '#3A3644',
    success: '#5FD39B',
  },
};

export const Motion = {
  fast: { duration: 150 },
  base: { duration: 300 },
  slow: { duration: 500 },
  staggerStep: 50,
  spring: { stiffness: 300, damping: 20, mass: 1 },
};
