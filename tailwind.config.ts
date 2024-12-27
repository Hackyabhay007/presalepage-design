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
          DEFAULT: '#9980FF', // Main purple-blue
          50: '#F7F5FF',    // Lightest purple-blue tint
          100: '#EBE7FF',   // Very light purple-blue
          200: '#D6CDFF',   // Light purple-blue
          300: '#BFB3FF',   // Moderate light purple-blue
          400: '#AC99FF',   // Medium purple-blue
          500: '#9980FF',   // Main purple-blue
          600: '#8066FF',   // Slightly darker purple-blue
          700: '#664DFF',   // Darker purple-blue
          800: '#4D33FF',   // Very dark purple-blue
          900: '#3319FF',   // Darkest purple-blue
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