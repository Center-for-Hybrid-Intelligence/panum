const appId = 'digiq_t'
module.exports = {
  purge: [
    './public/index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    `./${appId}/**/*.{vue,js,ts,jsx,tsx}`,
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    screens: { // px
      'h4': '400px',
      'h6': '600px',
      'h8': '800px',
      'k1': '1000px',
      'k15': '1500px',
      'k2': '2000px',
      'k25': '2500px',
      'k3': '3000px',
      'k35': '3500px',
    },
    extend: {
      animation: {
        'wiggle': 'wiggle 0.5s ease-in-out',
      },
      colors: {
        neutral: '#e5e7eb',
      },
      keyframes: {
        wiggle: {
          '0%': {transform: 'rotate(0deg)'},
          '33%': {transform: 'rotate(-3deg)'},
          '66%': {transform: 'rotate(3deg)'},
          '100%': {transform: 'rotate(0deg)'},
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
