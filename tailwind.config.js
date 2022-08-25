/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
  theme: {
    screens: {
      'xs': '300px',

      'sm': '450px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '954px',
      // => @media (min-width: 954px) { ... }

      'ml': "1100px", 
      // => medium-large @media (min-width: 1044x) {  } 

      'xl': '1200px',
      // => @media (min-width: 1200px) { ... }
    },
    extend: {
      colors: {
        'icon-grey': "#606f7b",
        'witch-yellow': '#eeb518e1'
      },
    },
    extend: {
      backgroundImage: {
        'wood-cut': "url('/images/wood-cut-background.jpeg')",
      }
    },
    fontSize: {
      'xs': '.75rem',
      'sm': '.875rem',
      'tiny': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    }
  },
  variants: {},
  plugins: []
}

