/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
        colors: {
            'pink': '#fe009c',
            'yellow': '#ffee07',
            'black': '#100e0e',
            'orange': '#f15204',
            'twitch': '#6441a5',
            'youtube': '#FF0000',
        },
        extend: {
            fontFamily: {
                'montserrat': ['"Montserrat"', 'cursive'],
            },
        },
    },
  plugins: [],
}

