/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    screens: {
      'xs': '475px',
    },
    extend: {
      colors: {
        workwaveBlue: '#003A9B',
      },
    },
  },
  plugins: [],
}

