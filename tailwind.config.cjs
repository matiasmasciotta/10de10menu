/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#121212',
        'brand-yellow': '#F59E0B', // Un amarillo/dorado similar al de la imagen
      },
      fontFamily: {
        'bebas': ['Bebas Neue', 'sans-serif'],
        'sans': ['ui-sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [],
}
