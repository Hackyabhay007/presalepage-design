// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Text colors
        text: {
          DEFAULT: '#FFFFFF',    // White text
          secondary: '#94A3B8',  // Lighter gray text
          muted: '#64748B',     // Muted text
        },
        // Background colors
        background: {
          DEFAULT: '#0B0B14',   // Main dark background
          secondary: '#151523',  // Slightly lighter background
          elevated: '#1E1E2D',  // Card/elevated background
        },
        // Primary colors (Blue)
        primary: {
          DEFAULT: '#818CF8',   // Main blue
          50: '#F5F7FF',
          100: '#EEF2FF',
          200: '#E0E7FF',
          300: '#C7D2FE',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        // Secondary colors (Purple)
        secondary: {
          DEFAULT: '#7E22CE',   // Main purple
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#7E22CE',
          700: '#6B21A8',
          800: '#581C87',
          900: '#3B0764',
        },
        // Accent colors (Pink)
        accent: {
          DEFAULT: '#EC4899',   // Main pink
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(180deg, #0B0B14 0%, #151523 100%)',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-secondary': '0 0 20px rgba(126, 34, 206, 0.3)',
        'glow-accent': '0 0 20px rgba(236, 72, 153, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config
