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
  @apply text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold;
}

h2 {
  font-family: "EB Garamond", sans-serif;
  @apply text-2xl sm:text-3xl md:text-4xl lg:text-5xl;
}

h3 {
  font-family: "EB Garamond", sans-serif;
  @apply text-xl sm:text-2xl md:text-3xl lg:text-4xl;
}

h4 {
  font-family: "EB Garamond", sans-serif;
  @apply text-lg sm:text-xl md:text-2xl lg:text-3xl;
}

.visually-hidden:not(:focus):not(:active) {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0); /* Legacy property for Internet Explorer */
  clip-path: inset(50%);
  white-space: nowrap;
}

p {
  font-family: "Roboto";
  @apply mb-3;
}

.link {
  @apply underline hover:text-gray-500;
}
</style>
