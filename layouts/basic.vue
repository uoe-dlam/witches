<template>
  <div id="main-wrapper">
    <main-nav-bar></main-nav-bar>
    <slot />
  </div>
</template>

<script>
import MainNavBar from "~/components/MainNavBar.vue";

export default {
  components: {
    MainNavBar,
  },
};
</script>

<style>
body {
  padding: 0 0;
  margin: 0 0 0 0;
  font-family: Arial;
  background: #f8fafc;
}

@tailwind base;

h1 {
  font-family: "EB Garamond", sans-serif;
  @apply text-5xl font-semibold mt-0;
}
h2 {
  font-family: "EB Garamond", sans-serif;
  @apply text-4xl;
}
h3 {
  font-family: "EB Garamond", sans-serif;
  @apply text-3xl;
}
h4 {
  @apply text-2xl;
}
</style>
