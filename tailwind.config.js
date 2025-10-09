/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'military-green': '#3d4f2f',
        'military-green-dark': '#2d3a20',
        'military-green-light': '#4a5d3f',
      }
    },
  },
  plugins: [],
}
