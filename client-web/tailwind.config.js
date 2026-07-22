/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Indigo-600
          hover: '#4338CA',
          light: '#EEF2FF'
        },
        secondary: {
          DEFAULT: '#22C55E', // Emerald-500
          hover: '#16A34A'
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber-500
          hover: '#D97706'
        },
        bgLight: '#F8FAFC',
        bgDark: '#0F172A'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
