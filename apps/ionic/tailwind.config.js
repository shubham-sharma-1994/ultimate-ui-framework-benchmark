/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // We will manage dark mode manually per requirements
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        surfaceAlt: 'var(--color-surfaceAlt)',
        primary: 'var(--color-primary)',
        onPrimary: 'var(--color-onPrimary)',
        accent: 'var(--color-accent)',
        text: 'var(--color-text)',
        textMuted: 'var(--color-textMuted)',
        outline: 'var(--color-outline)',
        success: 'var(--color-success)',
      },
      borderRadius: {
        'card': '20px',
        'btn': '14px',
        'chip': '999px',
        'input': '14px',
        'sheet': '28px',
      },
      boxShadow: {
        'e1': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'e2': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
      transitionTimingFunction: {
        'fast': 'cubic-bezier(0.2, 0, 0, 1)',
        'base': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'slow': 'cubic-bezier(0.05, 0.7, 0.1, 1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '300ms',
        'slow': '500ms',
      }
    },
  },
  plugins: [],
}
