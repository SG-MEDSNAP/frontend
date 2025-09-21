/** @type {import('tailwindcss').Config} */
module.exports = {
  // ✅ NativeWind preset 추가 (중요)
  presets: [require('nativewind/preset')],

  content: [
    './App.{js,jsx,ts,tsx}',
    './index.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // GrayScale Color
        gray: {
          50: '#ffffff',
          100: '#f2f2f2',
          200: '#d0d0d0',
          300: '#c2c2c2',
          400: '#a4a4a4',
          500: '#888888',
          600: '#707070',
          700: '#5c5c5c',
          800: '#303030',
          900: '#232323',
          950: '#000000',
        },
        // Primary Color (Blue)
        primary: {
          50: '#f4f7f4',
          100: '#9ae1ff',
          200: '#6fcbff',
          300: '#50a8ff',
          400: '#597aff',
          500: '#3546ff',
          600: '#354fc',
          700: '#1f2df1',
          800: '#1b19b4',
          900: '#1a1b5e',
          950: '#181556',
        },
        // Secondary Color (Orange/Yellow)
        secondary: {
          50: '#fff6ea',
          100: '#fff3c5',
          200: '#ffe885',
          300: '#ffd546',
          400: '#ffc01b',
          500: '#f89900',
          600: '#e27500',
          700: '#bb5002',
          800: '#983d08',
          900: '#7a330b',
          950: '#481800',
        },
        // Semantic Colors
        semantic: {
          blue: '#3780ff',
          green: '#33d488',
          yellow: '#ffc730',
          red: '#ff4141',
        },
      },
    },
  },
  plugins: [],
};
