// tailwind.config.js
module.exports = {
  purge: [],
  // purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow : {
        'card-shadow' : '0px 4px 12px rgba(0, 0, 0, 0.1)'
      },
      fontSize : {
        'xxs' : '10px'
      },
      minHeight : {
        'lg' : '32rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}