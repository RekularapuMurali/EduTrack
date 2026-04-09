/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#670D2F',
          medium: '#A53860',
          light: '#EF88AD',
          bg: '#3A0519',
        }
      }
    },
  },
  plugins: [],
};