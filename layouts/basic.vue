<template>
  <div id="main-wrapper">
    <main-nav-bar></main-nav-bar>
    <nuxt />
  </div>
</template>

<script>
    import  MainNavBar from '~/components/MainNavBar.vue'

    export default {
        components: {
            MainNavBar
        }
    }
</script>

<style>

body{
    padding: 0 0;
    margin: 0 0 0 0;
    font-family: Arial;
    background: #F8FAFC;
}


@tailwind base;

h1 {
    @apply text-2xl;
}
h2 {
    @apply text-xl;
}
h3 {
    @apply text-lg;
}

</style>