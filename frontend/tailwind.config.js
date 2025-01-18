/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
      bluish:"#003f88",
      violetPurple:"#d2b7e5"
      },
       backgroundImage: {
        'blue-to-white': 'linear-gradient(to right, #001845, white)', // Custom gradient
      }
    },
  },
  plugins: [],

}

