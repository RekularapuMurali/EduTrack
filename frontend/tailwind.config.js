/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#285A48',
          medium: '#408A71',
          light: '#B0E4CC',
          bg: '#091413',
        }
      }
    },
  },
  plugins: [],
};