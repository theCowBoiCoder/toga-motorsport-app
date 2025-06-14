/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
        fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
        colors: {
            'pink': '#fe009c',
            'yellow': '#ffee07',
            'black': '#100e0e',
            'orange': '#f15204',
            'twitch': '#6441a5',
            'youtube': '#FF0000',
        },
    },
  },
  plugins: [],
}

