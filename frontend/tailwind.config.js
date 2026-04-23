/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EFF4FF',
          100: '#DBE8FE',
          200: '#BFCFFE',
          300: '#93ADFD',
          400: '#6082FA',
          500: '#3B5BF6',
          600: '#2440EB',
          700: '#1B4FD8',
          800: '#1A3FA8',
          900: '#1C3A84',
          DEFAULT: '#1B4FD8',
        },
        success: {
          DEFAULT: '#059669',
          light: '#D1FAE5',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
        },
        surface: {
          light: '#F8FAFC',
          dark: '#0F172A',
        },
        card: {
          light: '#FFFFFF',
          dark: '#1E293B',
        },
        border: {
          light: '#E2E8F0',
          dark: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
        'card-md': '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.07)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn: { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
