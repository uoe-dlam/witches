<template>
    <div id="main-wrapper">
        <main-nav-bar></main-nav-bar>
        <slot />
        <cookie-banner></cookie-banner>
    </div>
</template>

<script setup>
import MainNavBar from '~/components/MainNavBar.vue'
import CookieBanner from '~/components/CookieBanner.vue'
</script>
