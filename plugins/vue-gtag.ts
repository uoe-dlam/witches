import { defineNuxtPlugin } from '#app';
import VueGtag from 'vue-gtag';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGtag, {
    config: { id: 'UA-57361601-29' },
    enabled: () => {
      const getGDPR = window.localStorage.getItem('GDPR:accepted')

      if (getGDPR !== null && getGDPR === 'no') {
        return false
      }

      if (getGDPR !== null && getGDPR === 'yes') {
        return true
      }

      return false
    }
  });
});