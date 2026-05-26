/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        luxe: {
          50: '#faf8f6',
          100: '#f3efe9',
          200: '#e6ddd2',
          300: '#d4c4b0',
          400: '#b89d7e',
          500: '#9a7b5c',
          600: '#7d6249',
          700: '#654f3c',
          800: '#544234',
          900: '#47382e',
          950: '#261d18',
        },
        ink: {
          DEFAULT: '#0f0e0d',
          muted: '#5c5650',
          faint: '#8a837a',
        },
      },
      boxShadow: {
        luxe: '0 4px 24px -4px rgba(38, 29, 24, 0.12)',
        'luxe-lg': '0 12px 48px -12px rgba(38, 29, 24, 0.18)',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
