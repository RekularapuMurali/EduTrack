/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#166534',
          medium: '#15803D',
          light: '#4ADE80',
          bg: '#DCFCE7',
        }
      }
    },
  },
  plugins: [],
};