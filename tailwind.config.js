/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  theme: {
    screens: {
      xs: "300px",

      sm: "450px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "954px",
      // => @media (min-width: 954px) { ... }

      ml: "1100px",
      // => medium-large @media (min-width: 1044x) {  }

      xl: "1200px",
      // => @media (min-width: 1200px) { ... }
    },
    extend: {
      colors: {
        "icon-grey": "#606f7b",
        "witch-yellow": "#eeb518e1",
      },
      backgroundImage: {
        "wood-cut": "url('/images/wood-cut-background.jpeg')",
      },
      fontSize: {
        'sm': '0.79rem',
      'tiny': '0.89rem',
      'base': '1rem',
      'lg': '1.13rem',
      'xl': '1.27rem',
      '2xl': '1.42rem',
      '3xl': '1.6rem',
      '4xl': '1.8rem',
      '5xl': '2.03rem',
      '6xl': '2.28rem',
      '7xl': '2.57rem',
      },
    },
  },
  variants: {},
  plugins: [],
};
