import Vue from 'vue'
import vueAnalytics from 'vue-analytics'

export default (ctx) => {
  Vue.use(vueAnalytics, {
    id: 'UA-57361601-29',
    disabled: () => {
      const getGDPR = window.localStorage.getItem('GDPR:accepted')

      if (getGDPR !== null && getGDPR === 'no') {
        return true
      }

      if (getGDPR !== null && getGDPR === 'yes') {
        return false
      }

      return true
    },
    router: ctx.app.router,
  })
};