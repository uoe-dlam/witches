<template>
    <div id="main-wrapper">
        <main-nav-bar></main-nav-bar>
        <slot />
    </div>
</template>

<script setup>
import MainNavBar from '~/components/MainNavBar.vue'
</script>
