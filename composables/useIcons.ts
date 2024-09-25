import { useState } from '#app';

export const useIcons = () => {
    const icons = useState<string[]>('icons', () => [
      '/images/witch-single-blue.png',
      '/images/witch-single-orange.png',
      '/images/witch-single-pink.png',
      '/images/witch-single-red.png',
      '/images/witch-single-brown.png',
      '/images/witch-single-green.png',
      '/images/witch-single-pale-blue.png',
      '/images/witch-single-yellow.png'
    ]);
  
    return { icons };
  };