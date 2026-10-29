<template>
    <div
        v-if="!hideBanner"
        class="w-full flex flex-col z-40 py-2 bg-slate-400 pr-3 fixed bottom-0"
    >
        <p class="text-xs md:text-sm ml-2 mt-1">
            We use cookies to analyse site traffic to understand our users'
            behaviour and how the site is doing, and to store your cookie
            preferences. This includes Google Analytics anonymised data. If you
            wish to turn off Google Analytics you can do so by clicking reject
            non essential cookies.
        </p>
        <div class="xflex self-end">
            <button
                class="rounded-sm bg-sky-600 hover:border-2 hover:border-sky-800 h-8 px-2 mr-3 mt-2 text-xs md:text-sm"
                @click="consentCookies()"
            >
                Accept all
            </button>
            <button
                class="rounded-sm bg-sky-600 hover:border-2 hover:border-sky-800 h-8 px-2 mr-4 mt-2 text-xs md:text-sm"
                @click="rejectCookies()"
            >
                Reject non essential cookies
            </button>
        </div>
    </div>
</template>

<script setup>
import { optIn, optOut, pageview } from 'vue-gtag'

const route = useRoute()
const consent = useCookie('edW')
const hideBanner = ref(true)

const consentCookies = () => {
    consent.value = 'yes'
    hideBanner.value = true

    if (import.meta.client) {
        localStorage.setItem('GDPR:accepted', 'yes')
        optIn()
        pageview(route.fullPath)
    }
}
const rejectCookies = () => {
    consent.value = 'yes'
    hideBanner.value = true

    if (import.meta.client) {
        localStorage.setItem('GDPR:accepted', 'no')
        optOut()
    }
}

onMounted(() => {
    if (consent.value === null || consent.value === undefined) {
        hideBanner.value = false
    }
})
</script>

<style>
a.normal:link {
    color: #0000ee;
    background-color: transparent;
    text-decoration: underline;
}

a.normal:visited {
    color: #551a8b;
    background-color: transparent;
    text-decoration: underline;
}
</style>
