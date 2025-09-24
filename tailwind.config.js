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
      fontFamily: {
        pretendard: ['Pretendard'],
      },
      colors: {
        // GrayScale Color
        gray: {
          50: '#ffffff',
          100: '#F2F2F2',
          200: '#D9D9D9',
          300: '#C2C2C2',
          400: '#A4A4A4',
          500: '#888888',
          600: '#707070',
          700: '#5C5C5C',
          800: '#3D3D3D',
          900: '#232323',
          950: '#000000',
        },

        // Primary Color (Blue)
        primary: {
          50: '#F4F7FF',
          100: '#EEF2FF',
          200: '#DAE1FF',
          300: '#BDC1FF',
          400: '#90A8FF',
          500: '#597AFF',
          600: '#354FFC',
          700: '#1F2DFF',
          800: '#1B19B4',
          900: '#1A1B8E',
          950: '#161556',
        },

        // Secondary Color (Orange/Yellow)
        secondary: {
          50: '#FFFCEA',
          100: '#FFF3C5',
          200: '#FFE885',
          300: '#FFD546',
          400: '#FFC01B',
          500: '#F89900',
          600: '#E27500',
          700: '#BB5002',
          800: '#983D08',
          900: '#7C330B',
          950: '#481800',
        },

        // Semantic Colors
        semantic: {
          blue: '#3798FF',
          green: '#33D486',
          yellow: '#FFC73C',
          red: '#FF4141',
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.no-font-padding': { includeFontPadding: false },
        '.h1': {
          fontFamily: 'Pretendard',
          fontWeight: '700',
          fontSize: 34,
          lineHeight: 42,
          includeFontPadding: false,
        },
        '.h2': {
          fontFamily: 'Pretendard',
          fontWeight: '700',
          fontSize: 30,
          lineHeight: 30,
          includeFontPadding: false,
        },
        '.h3': {
          fontFamily: 'Pretendard',
          fontWeight: '700',
          fontSize: 28,
          lineHeight: 36,
          includeFontPadding: false,
        },
        '.h4': {
          fontFamily: 'Pretendard',
          fontWeight: '700',
          fontSize: 24,
          lineHeight: 34,
          includeFontPadding: false,
        },
        '.h5': {
          fontFamily: 'Pretendard',
          fontWeight: '600',
          fontSize: 22,
          lineHeight: 24,
          includeFontPadding: false,
        },
        '.h6': {
          fontFamily: 'Pretendard',
          fontWeight: '700',
          fontSize: 20,
          lineHeight: 30,
          includeFontPadding: false,
        },
        '.h7': {
          fontFamily: 'Pretendard',
          fontWeight: '600',
          fontSize: 18,
          lineHeight: 26,
          includeFontPadding: false,
        },
        '.h8': {
          fontFamily: 'Pretendard',
          fontWeight: '600',
          fontSize: 16,
          lineHeight: 20,
          includeFontPadding: false,
        },
        '.label1': {
          fontFamily: 'Pretendard',
          fontWeight: '700',
          fontSize: 20,
          lineHeight: 20,
          includeFontPadding: false,
        },
        '.label2': {
          fontFamily: 'Pretendard',
          fontWeight: '700',
          fontSize: 18,
          lineHeight: 18,
          includeFontPadding: false,
        },
        '.label3': {
          fontFamily: 'Pretendard',
          fontWeight: '700',
          fontSize: 16,
          lineHeight: 16,
          includeFontPadding: false,
        },
        '.body-lg': {
          fontFamily: 'Pretendard',
          fontWeight: '600',
          fontSize: 20,
          lineHeight: 30,
          includeFontPadding: false,
        },
        '.body-md': {
          fontFamily: 'Pretendard',
          fontWeight: '500',
          fontSize: 18,
          lineHeight: 26,
          includeFontPadding: false,
        },
        '.body-sm': {
          fontFamily: 'Pretendard',
          fontWeight: '400',
          fontSize: 16,
          lineHeight: 24,
          includeFontPadding: false,
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
