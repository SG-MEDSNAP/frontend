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
  theme: { extend: {} },
  plugins: [],
};
