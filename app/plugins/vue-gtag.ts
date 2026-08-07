import { defineNuxtPlugin } from '#app'
import { configure } from 'vue-gtag'

export default defineNuxtPlugin(() => {
    const getGDPR = window.localStorage.getItem('GDPR:accepted')

    if (getGDPR !== 'yes') {
        return
    }

    configure({
        tagId: 'UA-57361601-29',
    })
})