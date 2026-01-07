/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient': 'linear-gradient(150.57deg, #16968c 14.49%, #0e3434 91.35%);',
      },
      colors:{
        'primary-light': '#EAF7FF',
        'gradient': 'linear-gradient(150.57deg, #16968c 14.49%, #0e3434 91.35%);',
        'filterBtn':'#707070',
        "filterBtnBg":'#F5F5F5',
        'bgactive':'#125D89',
      },
      boxShadow: {
        '3xl': '0px 1.38px 2.75px 0px #1212170D',
      }

    },
  },
  plugins: [],
}
