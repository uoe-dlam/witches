export const state = () => ({
  icons: ['/images/witch-single-blue.png',
    '/images/witch-single-orange.png',
    '/images/witch-single-pink.png',
    '/images/witch-single-red.png',
    '/images/witch-single-brown.png',
    '/images/witch-single-green.png',
    '/images/witch-single-pale-blue.png',
    '/images/witch-single-yellow.png'
  ]
});

export const getters = {
  getIcons: state => {
    return state.icons;
  }
};